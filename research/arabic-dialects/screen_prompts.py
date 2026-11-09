import json
from pathlib import Path
from dialect_id import classify

data = json.loads((Path(__file__).parent / "data" / "dialect_prompts.json").read_text())
report = {}
for region in ["egy", "lev", "glf", "mgr", "msa"]:
    preds = classify(data[region])
    ok = [p["region"] == region for p in preds]
    report[region] = {"passed": sum(ok), "total": len(ok)}
    for text, p, good in zip(data[region], preds, ok):
        flag = "ok " if good else "XX "
        print(flag, region, "->", p["region"], f"{p['probs'].get(region,0):.2f}", text)
print(json.dumps(report))
(Path(__file__).parent / "results" / "prompt_screen.json").write_text(json.dumps(report, indent=2))
