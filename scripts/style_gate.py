#!/usr/bin/env python3
"""Run Malak's style rules (malak-style skill) over every piece of visible prose on the site.

Checks MDX bodies, the human-readable frontmatter fields, and the copy in .astro pages.
URLs, imports, code and component markup are stripped first so only reader-facing text is judged.

Usage: python3 scripts/style_gate.py [paths...]   (defaults to src/content and src/pages)
Set MALAK_STYLE_CHECK to point at style_check.py if it is not in the default skill location.
"""
from __future__ import annotations

import importlib.util
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CHECKER = Path.home() / ".copilot/skills/malak-style/scripts/style_check.py"
PROSE_KEYS = ("title", "short", "summary", "dek", "caption", "label", "value", "role", "org", "period")


def load_checker():
    path = Path(os.environ.get("MALAK_STYLE_CHECK", DEFAULT_CHECKER))
    if not path.exists():
        sys.exit(f"style checker not found at {path} (set MALAK_STYLE_CHECK)")
    spec = importlib.util.spec_from_file_location("style_check", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def strip_urls(text: str) -> str:
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    return re.sub(r"https?://\S+|mailto:\S+", "", text)


def mdx_prose(raw: str) -> str:
    lines: list[str] = []
    body = raw
    match = re.match(r"^---\n(.*?)\n---\n", raw, re.S)
    if match:
        body = raw[match.end():]
        for line in match.group(1).splitlines():
            m = re.match(r"^\s*-?\s*(\w+):\s*(.+)$", line)
            if m and m.group(1) in PROSE_KEYS:
                lines.append(m.group(2).strip().strip("'\""))
    in_jsx = False
    for line in body.splitlines():
        s = line.strip()
        if s.startswith("import ") or s.startswith("export "):
            continue
        if s.startswith("<") and not s.startswith("<sup"):
            in_jsx = not (s.endswith("/>") or s.endswith(">") and s.count("<") == s.count(">") and "</" in s)
            lines.extend(re.findall(r'(?:caption|alt|title)="([^"]+)"', s))
            continue
        if in_jsx:
            lines.extend(re.findall(r'(?:caption|alt|title)="([^"]+)"', s))
            if s.endswith("/>") or s.endswith(">"):
                in_jsx = False
            continue
        lines.append(re.sub(r"<[^>]+>", "", line))
    return strip_urls("\n".join(lines))


def astro_prose(raw: str) -> str:
    lines: list[str] = []
    template = raw
    match = re.match(r"^---\n(.*?)\n---\n", raw, re.S)
    if match:
        template = raw[match.end():]
        lines.extend(s for s in re.findall(r"'([^'\n]{12,})'", match.group(1)) if " " in s and not s.startswith(("/", "http")))
    template = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", template, flags=re.S)
    template = re.sub(r"\{[^{}]*\}", " ", template)
    for chunk in re.split(r"</?(?:p|li|h\d|div|section|span|a|dd|dt|figcaption|header|footer|article|aside|ul|nav|em|strong|br)\b[^>]*>", template):
        text = re.sub(r"<[^>]+>", " ", chunk)
        text = re.sub(r"\s+", " ", text).strip()
        if len(text.split()) >= 3:
            lines.append(text)
    return strip_urls("\n".join(lines))


def main() -> int:
    checker = load_checker()
    targets = [Path(p) for p in sys.argv[1:]] or [ROOT / "src/content", ROOT / "src/pages", ROOT / "src/components"]
    files = []
    for target in targets:
        files.extend(sorted(target.rglob("*.mdx")) + sorted(target.rglob("*.md")) + sorted(target.rglob("*.astro")) if target.is_dir() else [target])
    failed = 0
    for path in files:
        raw = path.read_text(encoding="utf-8")
        prose = astro_prose(raw) if path.suffix == ".astro" else mdx_prose(raw)
        if not prose.strip():
            continue
        problems = checker.violations(prose)
        if path.suffix == ".astro":
            problems = [p for p in problems if not p.startswith("concrete")]
        rel = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path
        if problems:
            failed += 1
            print(f"x {rel}")
            for p in problems:
                print(f"    - {p}")
        else:
            print(f"ok {rel}")
    print(f"\n{len(files) - failed}/{len(files)} files clean")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
