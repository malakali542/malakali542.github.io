// Publishes the Arabic dialects benchmark (code, prompts, raw replies, scores) under /research/arabic-dialects/.
// The AraDiCE question text itself is not republished: fetch_data.py downloads it from Hugging Face.
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

const src = 'research/arabic-dialects';
const dest = 'public/research/arabic-dialects';

const fixed = [
  'README.md',
  'fetch_data.py',
  'dialect_id.py',
  'screen_prompts.py',
  'run_bench.py',
  'score.py',
  'data/dialect_prompts.json',
  'results/prompt_screen.json',
  'results/summary.json',
  'results/summary.md',
];
const results = existsSync(join(src, 'results'))
  ? readdirSync(join(src, 'results'))
      .filter((f) => /^(mcq|gen)_.+\.jsonl$/.test(f))
      .map((f) => `results/${f}`)
  : [];

rmSync(dest, { recursive: true, force: true });
let copied = 0;
for (const file of [...fixed, ...results]) {
  const from = join(src, file);
  if (!existsSync(from)) continue;
  const to = join(dest, file);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  copied += 1;
}
console.log(`sync-research: published ${copied} files to ${dest}`);
