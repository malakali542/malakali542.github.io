"""Run both tasks against local Ollama models. Resumable: finished rows are skipped on rerun.

Task 1 (comprehension): AraDiCE-OpenBookQA, same 200 questions in English, MSA, Egyptian, Levantine.
Task 2 (dialect fidelity): 12 everyday requests per dialect plus MSA controls, answered with and
without an explicit instruction to reply in the user's dialect.
"""
import argparse
import json
import re
import time
from pathlib import Path

import requests

ROOT = Path(__file__).parent
OLLAMA = "http://localhost:11434/api/chat"
MODELS = ["qwen2.5:3b", "qwen2.5:7b", "aya-expanse:8b", "command-r7b-arabic"]
VARIANTS = ["eng", "msa", "egy", "lev"]
DIALECTS = ["egy", "lev", "glf", "mgr"]

MCQ_SYSTEM = (
    "You are answering multiple-choice questions. "
    "Reply with only the letter of the correct option: A, B, C, or D."
)
FIDELITY_SYSTEM = (
    "Reply in the same Arabic dialect the user writes in. "
    "Do not switch to Modern Standard Arabic."
)
ARABIC_LETTERS = {"أ": "A", "ا": "A", "ب": "B", "ج": "C", "د": "D"}


def chat(model: str, messages: list[dict], num_predict: int) -> tuple[str, float]:
    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
        "options": {"temperature": 0, "seed": 7, "num_predict": num_predict, "num_ctx": 2048},
    }
    start = time.time()
    resp = requests.post(OLLAMA, json=payload, timeout=600)
    resp.raise_for_status()
    return resp.json()["message"]["content"], time.time() - start


def parse_letter(text: str) -> str | None:
    match = re.search(r"\b([ABCD])\b", text.upper())
    if match:
        return match.group(1)
    for ch in text.strip():
        if ch in ARABIC_LETTERS:
            return ARABIC_LETTERS[ch]
    return None


def done_keys(path: Path, fields: tuple[str, ...]) -> set[tuple]:
    if not path.exists():
        return set()
    with path.open(encoding="utf-8") as fh:
        return {tuple(json.loads(line)[f] for f in fields) for line in fh if line.strip()}


def slug(model: str) -> str:
    return model.replace(":", "-").replace("/", "-")


def run_mcq(model: str, limit: int | None) -> None:
    items = [json.loads(line) for line in (ROOT / "data" / "obqa_parallel.jsonl").open(encoding="utf-8")]
    items = items[:limit] if limit else items
    out_path = ROOT / "results" / f"mcq_{slug(model)}.jsonl"
    seen = done_keys(out_path, ("idx", "variant"))
    with out_path.open("a", encoding="utf-8") as out:
        for item in items:
            for variant in VARIANTS:
                if (item["idx"], variant) in seen:
                    continue
                v = item["variants"][variant]
                options = "\n".join(f"{label}) {text}" for label, text in v["choices"])
                user = f"{v['stem']}\n\n{options}\n\nAnswer:"
                raw, secs = chat(model, [{"role": "system", "content": MCQ_SYSTEM}, {"role": "user", "content": user}], 6)
                pred = parse_letter(raw)
                out.write(json.dumps({
                    "model": model, "idx": item["idx"], "variant": variant, "answer": item["answer"],
                    "pred": pred, "correct": pred == item["answer"], "raw": raw, "secs": round(secs, 2),
                }, ensure_ascii=False) + "\n")
                out.flush()


def run_fidelity(model: str) -> None:
    prompts = json.loads((ROOT / "data" / "dialect_prompts.json").read_text(encoding="utf-8"))
    out_path = ROOT / "results" / f"gen_{slug(model)}.jsonl"
    seen = done_keys(out_path, ("region", "i", "condition"))
    jobs = [(r, i, "plain") for r in DIALECTS + ["msa"] for i in range(len(prompts[r]))]
    jobs += [(r, i, "instructed") for r in DIALECTS for i in range(len(prompts[r]))]
    with out_path.open("a", encoding="utf-8") as out:
        for region, i, condition in jobs:
            if (region, i, condition) in seen:
                continue
            messages = [{"role": "user", "content": prompts[region][i]}]
            if condition == "instructed":
                messages.insert(0, {"role": "system", "content": FIDELITY_SYSTEM})
            raw, secs = chat(model, messages, 120)
            out.write(json.dumps({
                "model": model, "region": region, "i": i, "condition": condition,
                "prompt": prompts[region][i], "response": raw, "secs": round(secs, 2),
            }, ensure_ascii=False) + "\n")
            out.flush()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--models", nargs="*", default=MODELS)
    parser.add_argument("--tasks", nargs="*", default=["mcq", "fidelity"])
    parser.add_argument("--limit", type=int, default=None, help="limit MCQ items (smoke test)")
    args = parser.parse_args()
    for model in args.models:
        t0 = time.time()
        if "mcq" in args.tasks:
            run_mcq(model, args.limit)
        if "fidelity" in args.tasks:
            run_fidelity(model)
        print(f"{model}: {time.time() - t0:.0f}s", flush=True)


if __name__ == "__main__":
    main()
