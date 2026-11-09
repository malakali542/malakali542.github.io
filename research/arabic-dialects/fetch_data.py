"""Download AraDiCE-OpenBookQA (QCRI, CC BY-NC-SA 4.0) and align the four parallel variants by idx."""
import json
import random
import time
from pathlib import Path

import requests

DATASET = "QCRI/AraDiCE-OpenBookQA"
VARIANTS = {"eng": "OBQA-eng", "msa": "OBQA-msa", "egy": "OBQA-egy", "lev": "OBQA-lev"}
API = "https://datasets-server.huggingface.co/rows"
OUT = Path(__file__).parent / "data" / "obqa_parallel.jsonl"
SAMPLE_SIZE = 200
SEED = 7


def fetch_config(config: str) -> list[dict]:
    rows, offset = [], 0
    while True:
        params = {"dataset": DATASET, "config": config, "split": "test", "offset": offset, "length": 100}
        for attempt in range(5):
            resp = requests.get(API, params=params, timeout=60)
            if resp.status_code == 200:
                break
            time.sleep(2 * (attempt + 1))
        resp.raise_for_status()
        batch = [r["row"] for r in resp.json()["rows"]]
        rows.extend(batch)
        if len(batch) < 100:
            return rows
        offset += 100


def main() -> None:
    by_variant = {}
    for key, config in VARIANTS.items():
        rows = fetch_config(config)
        by_variant[key] = {str(r["idx"]).strip(): r for r in rows}
        print(f"{config}: {len(rows)} rows")

    shared = sorted(set.intersection(*(set(v) for v in by_variant.values())))
    print(f"aligned across all four variants: {len(shared)}")
    random.Random(SEED).shuffle(shared)
    sample = shared[:SAMPLE_SIZE]

    with OUT.open("w", encoding="utf-8") as fh:
        for idx in sample:
            item = {"idx": idx, "variants": {}}
            keys = {by_variant[k][idx]["answerKey"].strip() for k in VARIANTS}
            if len(keys) != 1:
                continue
            item["answer"] = keys.pop()
            for key in VARIANTS:
                q = by_variant[key][idx]["question"]
                item["variants"][key] = {
                    "stem": q["stem"].strip(),
                    "choices": [(c["label"].strip(), c["text"].strip()) for c in q["choices"]],
                }
            fh.write(json.dumps(item, ensure_ascii=False) + "\n")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
