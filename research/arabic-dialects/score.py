"""Score both tasks and write results/summary.json + results/summary.md.

Task 1: accuracy per model and variant with 95% bootstrap CIs, plus paired drops from MSA.
Task 2: dialect of each response via CAMeLBERT-DID (MADAR-6), reported as the share of replies in
the user's dialect, in MSA, or in another dialect, for plain and instructed conditions.
"""
import json
import random
import re
from collections import Counter, defaultdict
from pathlib import Path

from dialect_id import classify

ROOT = Path(__file__).parent
RESULTS = ROOT / "results"
MODELS = ["qwen2.5:3b", "qwen2.5:7b", "aya-expanse:8b", "command-r7b-arabic"]
VARIANTS = ["eng", "msa", "egy", "lev"]
DIALECTS = ["egy", "lev", "glf", "mgr"]
BOOT = 2000
rng = random.Random(7)


def slug(model: str) -> str:
    return model.replace(":", "-").replace("/", "-")


def load(prefix: str, model: str) -> list[dict]:
    path = RESULTS / f"{prefix}_{slug(model)}.jsonl"
    if not path.exists():
        return []
    rows, seen = [], set()
    for line in path.open(encoding="utf-8"):
        if not line.strip():
            continue
        row = json.loads(line)
        key = (row.get("idx"), row.get("variant"), row.get("region"), row.get("i"), row.get("condition"))
        if key not in seen:
            seen.add(key)
            rows.append(row)
    return rows


def boot_ci(values: list[int]) -> tuple[float, float]:
    n = len(values)
    means = sorted(sum(values[rng.randrange(n)] for _ in range(n)) / n for _ in range(BOOT))
    return means[int(0.025 * BOOT)], means[int(0.975 * BOOT)]


def score_mcq(model: str) -> dict | None:
    rows = load("mcq", model)
    by = defaultdict(dict)
    for r in rows:
        by[r["idx"]][r["variant"]] = int(bool(r["correct"]))
    complete = [idx for idx, v in by.items() if all(k in v for k in VARIANTS)]
    if not complete:
        return None
    out = {"n": len(complete), "acc": {}, "ci": {}, "drop_from_msa": {}, "unparsed": sum(r["pred"] is None for r in rows)}
    for variant in VARIANTS:
        vals = [by[i][variant] for i in complete]
        out["acc"][variant] = 100 * sum(vals) / len(vals)
        lo, hi = boot_ci(vals)
        out["ci"][variant] = [100 * lo, 100 * hi]
    for variant in ["egy", "lev"]:
        diffs = [by[i]["msa"] - by[i][variant] for i in complete]
        lo, hi = boot_ci(diffs)
        out["drop_from_msa"][variant] = {"pts": 100 * sum(diffs) / len(diffs), "ci": [100 * lo, 100 * hi]}
    return out


def score_fidelity(rows: list[dict], labels: dict) -> dict | None:
    if not rows:
        return None
    out = {}
    for condition in ["plain", "instructed"]:
        cond = {}
        regions = DIALECTS + (["msa"] if condition == "plain" else [])
        for region in regions:
            subset = [r for r in rows if r["condition"] == condition and r["region"] == region]
            if not subset:
                continue
            preds = [labels[(r["model"], r["region"], r["i"], r["condition"])] for r in subset]
            counts = Counter(preds)
            n = len(preds)
            cjk = sum(bool(re.search(r"[\u3040-\u30ff\u4e00-\u9fff]", r["response"])) for r in subset)
            cond[region] = {
                "cjk_leak": 100 * cjk / n,
                "n": n,
                "match": 100 * counts[region] / n,
                "msa": 100 * counts["msa"] / n,
                "other": 100 * (n - counts[region] - (counts["msa"] if region != "msa" else 0)) / n,
                "labels": dict(counts),
            }
        others = [cond[r] for r in ("lev", "glf", "mgr") if r in cond]
        if others:
            n_other = sum(d["n"] for d in others)
            cond["non_egy_to_egy"] = 100 * sum(d["labels"].get("egy", 0) for d in others) / n_other
        dial = [cond[r] for r in DIALECTS if r in cond]
        if dial:
            total = sum(d["n"] for d in dial)
            cond["all_dialects"] = {
                "n": total,
                "cjk_leak": sum(d["cjk_leak"] * d["n"] for d in dial) / total,
                "match": sum(d["match"] * d["n"] for d in dial) / total,
                "msa": sum(d["msa"] * d["n"] for d in dial) / total,
            }
        out[condition] = cond
    return out


def tokens(variant: dict) -> set[str]:
    text = variant["stem"] + " " + " ".join(choice for _, choice in variant["choices"])
    text = re.sub(r"[\u064B-\u0652\u0640]", "", text)
    text = re.sub(r"[\u0625\u0623\u0622\u0627]", "\u0627", text).replace("\u0629", "\u0647").replace("\u0649", "\u064A")
    return set(re.findall(r"[\u0621-\u064A]+", text))


def dataset_overlap() -> dict:
    """Mean word-level Jaccard overlap between each dialect version and the MSA version of the same item."""
    items = [json.loads(line) for line in (ROOT / "data" / "obqa_parallel.jsonl").open(encoding="utf-8")]
    out = {}
    for dialect in ["egy", "lev"]:
        sims = []
        for item in items:
            a, b = tokens(item["variants"]["msa"]), tokens(item["variants"][dialect])
            sims.append(len(a & b) / max(1, len(a | b)))
        out[dialect] = 100 * sum(sims) / len(sims)
    return out


def main() -> None:
    gen_by_model = {m: load("gen", m) for m in MODELS}
    gen_rows = [r for m in MODELS for r in gen_by_model[m]]
    texts = [r["response"] for r in gen_rows]
    preds = classify(texts) if texts else []
    labels = {(r["model"], r["region"], r["i"], r["condition"]): p["region"] for r, p in zip(gen_rows, preds)}
    with (RESULTS / "gen_labels.jsonl").open("w", encoding="utf-8") as fh:
        for r, p in zip(gen_rows, preds):
            fh.write(json.dumps({**{k: r[k] for k in ("model", "region", "i", "condition")}, "pred": p["region"], "probs": p["probs"]}) + "\n")

    summary = {"mcq": {}, "fidelity": {}, "msa_word_overlap": dataset_overlap()}
    for model in MODELS:
        mcq = score_mcq(model)
        if mcq:
            summary["mcq"][model] = mcq
        fid = score_fidelity(gen_by_model[model], labels)
        if fid:
            summary["fidelity"][model] = fid
    (RESULTS / "summary.json").write_text(json.dumps(summary, indent=2))

    lines = ["## Task 1: comprehension (AraDiCE OpenBookQA, same questions)", "", "| model | n | English | MSA | Egyptian | Levantine | drop EGY | drop LEV |", "|---|---|---|---|---|---|---|---|"]
    for model, s in summary["mcq"].items():
        a, d = s["acc"], s["drop_from_msa"]
        lines.append(f"| {model} | {s['n']} | {a['eng']:.1f} | {a['msa']:.1f} | {a['egy']:.1f} | {a['lev']:.1f} | {d['egy']['pts']:.1f} [{d['egy']['ci'][0]:.1f}, {d['egy']['ci'][1]:.1f}] | {d['lev']['pts']:.1f} [{d['lev']['ci'][0]:.1f}, {d['lev']['ci'][1]:.1f}] |")
    ov = summary["msa_word_overlap"]
    lines += ["", f"Mean word overlap with the MSA version of each item: Egyptian {ov['egy']:.1f}%, Levantine {ov['lev']:.1f}%"]
    lines += ["", "## Task 2: dialect fidelity (share of replies in the user's dialect / in MSA)", ""]
    for condition in ["plain", "instructed"]:
        lines += [f"### {condition}", "", "| model | EGY match | LEV match | GLF match | MGR match | all match | all MSA | CJK leak | MSA prompts answered in MSA |", "|---|---|---|---|---|---|---|---|---|"]
        for model, f in summary["fidelity"].items():
            c = f.get(condition, {})
            if not c:
                continue
            cell = lambda r, k="match": f"{c[r][k]:.0f}" if r in c else "-"
            lines.append(f"| {model} | {cell('egy')} | {cell('lev')} | {cell('glf')} | {cell('mgr')} | {cell('all_dialects')} | {cell('all_dialects', 'msa')} | {cell('all_dialects', 'cjk_leak')} | {cell('msa')} |")
        lines.append("")
        lines.append("Share of Levantine, Gulf and Moroccan prompts answered in Egyptian: " + ", ".join(
            f"{m} {f[condition]['non_egy_to_egy']:.0f}%" for m, f in summary["fidelity"].items() if "non_egy_to_egy" in f.get(condition, {})))
        lines.append("")
    (RESULTS / "summary.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
