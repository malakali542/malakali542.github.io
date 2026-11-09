# Arabic dialects benchmark

The harness behind the post [Ask in Egyptian, get answered in MSA](/writing/arabic-dialects-benchmark/). Two small tests, run locally on four open models, with every prompt and raw output kept in `results/`.

## Setup

- **Hardware:** MacBook Air (M2, 16 GB)
- **Runtime:** Ollama, all models in its default Q4_K_M quantization
- **Models:** `qwen2.5:3b` (3.1B), `qwen2.5:7b` (7.6B), `aya-expanse:8b` (8.0B, multilingual), `command-r7b-arabic` (8.0B, built for Arabic)
- **Decoding:** temperature 0, seed 7, `num_ctx` 2048

Each model is prompted through its own chat template, so the same system message reaches every model in the format it was trained on. For Command R7B Arabic that template adds Cohere's default preamble.

## Task 1: comprehension on the same questions

[AraDiCE](https://arxiv.org/abs/2409.11404) (Mousi et al., QCRI) post-edited OpenBookQA into Modern Standard Arabic, Egyptian and Levantine, alongside the English original. Because the four versions are parallel, any accuracy gap comes from the language variety, not the question.

- `fetch_data.py` downloads the four test configs, aligns them by `idx` (497 shared items) and samples 200 with seed 7.
- Each question is asked zero-shot as multiple choice. The system message asks for the letter only, and the first A to D in the reply is scored.
- `score.py` reports accuracy per variety with 2,000-sample bootstrap 95% intervals, plus the paired drop from MSA to each dialect.

## Task 2: does the model answer in your dialect?

- `data/dialect_prompts.json` holds 12 everyday requests (cooking, sleep, a slow phone, asking for time off and so on) written in Egyptian, Levantine, Gulf and Moroccan Darija, plus 8 MSA controls.
- Every prompt is screened with [CAMeLBERT-DID MADAR-6](https://huggingface.co/CAMeL-Lab/bert-base-arabic-camelbert-mix-did-madar-corpus6) (Inoue et al., 2021). All 56 are classified as the intended variety (`results/prompt_screen.json`). Two Gulf prompts were rewritten after the first screen read them as Egyptian.
- Each prompt is sent twice: **plain** (no system message) and **instructed** (system message: reply in the user's dialect, don't switch to MSA). Replies are capped at 120 tokens.
- Replies are labeled with the same classifier. MADAR's city labels map to regions: Cairo to Egyptian, Beirut to Levantine, Doha to Gulf, Rabat and Tunis to Maghrebi.
- `score.py` also counts replies containing Chinese or Japanese characters, a script leak that showed up in early runs.

## Reproduce

```bash
python3 -m venv .venv && .venv/bin/pip install torch transformers requests
for m in qwen2.5:3b qwen2.5:7b aya-expanse:8b command-r7b-arabic; do ollama pull $m; done
.venv/bin/python fetch_data.py
.venv/bin/python screen_prompts.py
.venv/bin/python run_bench.py          # resumable, a few hours on an M2 Air
.venv/bin/python score.py              # writes results/summary.json and summary.md
```

## Caveats

- Small models, 4-bit quantized, one run each at temperature 0. This is a probe, not a leaderboard.
- 200 questions per variety gives intervals of roughly ±6 points, so read small gaps with care. The paired drops are tighter because each question is its own control.
- The dialect classifier was trained on MADAR's travel-domain sentences. Spot checks of replies matched its labels, but it can't tell good Egyptian from broken Egyptian.
- I wrote the dialect prompts myself. The classifier screen keeps them honest about which dialect they're in, not about how natural they sound.

## Data and licenses

`fetch_data.py` recreates `data/obqa_parallel.jsonl`, a 200-item subset of AraDiCE OpenBookQA released by QCRI under CC BY-NC-SA 4.0. The question text isn't republished here. The prompts, code and model replies in this folder are mine.
