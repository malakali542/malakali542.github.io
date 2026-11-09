## Task 1: comprehension (AraDiCE OpenBookQA, same questions)

| model | n | English | MSA | Egyptian | Levantine | drop EGY | drop LEV |
|---|---|---|---|---|---|---|---|
| qwen2.5:3b | 200 | 77.0 | 61.5 | 43.0 | 56.0 | 18.5 [10.0, 26.5] | 5.5 [-2.0, 13.5] |
| qwen2.5:7b | 200 | 83.5 | 69.0 | 56.0 | 63.5 | 13.0 [5.5, 20.5] | 5.5 [-2.0, 13.0] |
| aya-expanse:8b | 200 | 79.0 | 73.0 | 52.5 | 66.5 | 20.5 [12.5, 28.5] | 6.5 [0.5, 12.0] |
| command-r7b-arabic | 200 | 77.0 | 70.0 | 57.5 | 61.5 | 12.5 [5.5, 19.5] | 8.5 [1.5, 15.0] |

Mean word overlap with the MSA version of each item: Egyptian 20.6%, Levantine 29.8%

## Task 2: dialect fidelity (share of replies in the user's dialect / in MSA)

### plain

| model | EGY match | LEV match | GLF match | MGR match | all match | all MSA | CJK leak | MSA prompts answered in MSA |
|---|---|---|---|---|---|---|---|---|
| qwen2.5:3b | 0 | 0 | 8 | 0 | 2 | 98 | 6 | 100 |
| qwen2.5:7b | 0 | 0 | 0 | 0 | 0 | 100 | 2 | 100 |
| aya-expanse:8b | 0 | 0 | 0 | 0 | 0 | 100 | 0 | 100 |
| command-r7b-arabic | 0 | 0 | 0 | 0 | 0 | 100 | 0 | 100 |

Share of Levantine, Gulf and Moroccan prompts answered in Egyptian: qwen2.5:3b 0%, qwen2.5:7b 0%, aya-expanse:8b 0%, command-r7b-arabic 0%

### instructed

| model | EGY match | LEV match | GLF match | MGR match | all match | all MSA | CJK leak | MSA prompts answered in MSA |
|---|---|---|---|---|---|---|---|---|
| qwen2.5:3b | 83 | 33 | 8 | 25 | 38 | 6 | 27 | - |
| qwen2.5:7b | 83 | 0 | 0 | 17 | 25 | 31 | 31 | - |
| aya-expanse:8b | 33 | 0 | 0 | 0 | 8 | 92 | 0 | - |
| command-r7b-arabic | 58 | 0 | 0 | 25 | 21 | 67 | 0 | - |

Share of Levantine, Gulf and Moroccan prompts answered in Egyptian: qwen2.5:3b 67%, qwen2.5:7b 53%, aya-expanse:8b 0%, command-r7b-arabic 11%

