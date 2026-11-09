# malak ali · portfolio

Personal site: case studies with video, a writing section, and an about page. Static [Astro](https://astro.build) 7 + MDX, no client framework. The only JavaScript is a small inline script for the theme toggle, in-view video autoplay, click-to-load YouTube, and the animated illustrations.

## Run it

Requires Node 22.12+.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
npm run style     # check all site prose against the malak-style rules
```

## Deploy

The site lives at [malak.club](https://malak.club), served by GitHub Pages from the public repo [malakali542/malakali542.github.io](https://github.com/malakali542/malakali542.github.io). Every push to its `main` branch runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/`. `SITE_URL` (default `https://malak.club`) sets canonical URLs and the sitemap. The custom domain is set in the repo's Pages settings, not with a `CNAME` file, because Actions deployments ignore that file.

The source of truth is `portfolio/` in the private protos repo. To publish, run this from the protos repo root:

```bash
git subtree push --prefix=portfolio site main
```

(`site` is a git remote pointing at the public repo.)

DNS for malak.club is managed at GoDaddy: four `A` records for `@` pointing to GitHub Pages (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a `CNAME` for `www` pointing to `malakali542.github.io`.

## Where things live

| path | what |
|---|---|
| `src/content/work/*.mdx` | case studies. Frontmatter drives the cards, metrics and facts. The body is MDX. |
| `src/content/writing/*.mdx` | blog posts (`title`, `dek`, `date`, `tags`). The date is what the site shows. |
| `src/content.config.ts` | the schema for both collections |
| `src/pages/index.astro` | home page copy and the experience lists |
| `src/pages/about.astro` | about, experience timeline, community, honors |
| `src/pages/ai.astro` | how I use AI: models, orchestration, harnesses, skills, and what I built with them |
| `src/components/Media.astro` | renders a card or hero from `kind: video \| youtube \| demo \| image` |
| `src/components/demos/` | animated illustrations for work with no public footage (Copilot, PointClickCare, MapStore, BridgeTO). Each one is labeled "illustration" on the page. |
| `public/media/` | self-hosted media (Dots and Scout demo videos and posters) |
| `research/arabic-dialects/` | the benchmark behind the Arabic dialects post: harness, prompts, raw replies and scores |
| `scripts/sync-research.mjs` | runs before `dev` and `build`, publishing the benchmark files at `/research/arabic-dialects/` (the AraDiCE question text is left out, `fetch_data.py` downloads it) |

### Adding a case study

Create `src/content/work/<slug>.mdx`:

```yaml
---
title: 'Project: what it does'
short: Project
org: Company
role: product manager
period: 2025 - 2026
order: 10            # position on the home page
group: work          # work | building | community
summary: One or two sentences for the card and the page lede.
card:
  kind: youtube      # or video (src, poster, frame: none|laptop|phone, fit, start), demo (name), image (src, alt)
  id: VIDEO_ID
  title: Video title
  hd: true           # use the max-res YouTube thumbnail when it exists
metrics:
  - value: 30%
    label: what moved
---
```

MDX bodies can import `VideoBlock`, `Figure`, `DemoBlock`, `FacebookVideo` and `BarChart` from `src/components/`.

## Media sources

- **Dots and Scout**: demo videos and screens copied from [ericdachen.com/design](https://ericdachen.com/design), from the projects Malak built with Eric Chen.
- **Quine**: the official [Microsoft Research announcement](https://www.microsoft.com/en-us/research/blog/introducing-quine-an-ai-research-system-designed-for-the-complexity-of-biology/) video (YouTube) and figure animations, embedded from microsoft.com rather than re-hosted.
- **Recall**: the official Windows video, Microsoft ExpertZone's retail video, and the first-run screenshot from the Windows Insider Blog, all embedded from their sources.
- **UberX Share**: Uber's official launch video.
- **BridgeTO**: BridgeTO's own Facebook video of the Your Voice is Power hackathon.
- **Arabic dialects post**: every example reply is a real model output from `research/arabic-dialects/results/`, and the charts read `summary.json` directly.

YouTube embeds use `youtube-nocookie.com` and only load after a click.

## Writing style

`npm run style` runs every case study, post and page through the `malak-style` checker (no em dashes, no buzzwords, no hedges, concrete numbers, no semicolon chains, no runs of short sentences). It loads the checker from `~/.copilot/skills/malak-style/scripts/style_check.py`. Set `MALAK_STYLE_CHECK` to use a different copy.
