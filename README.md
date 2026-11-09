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

The source of truth is `portfolio/` in the private protos repo. To publish, commit there, then run this from the root of a protos checkout whose branch contains `portfolio/`:

```bash
git subtree push --prefix=portfolio site main
```

(`site` is a git remote pointing at the public repo.)

DNS for malak.club is managed at GoDaddy: four `A` records for `@` pointing to GitHub Pages (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153), four `AAAA` records for IPv6 (2606:50c0:8000::153 through 2606:50c0:8003::153) and a `CNAME` for `www` pointing to `malakali542.github.io`. GitHub issues and renews the Let's Encrypt certificate for both names, and Enforce HTTPS is on, so `http://` and `www.` both redirect to `https://malak.club`. If the certificate ever stops renewing after a DNS change, remove and re-add the custom domain under Settings → Pages.

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
| `src/components/demos/` | animated illustrations for work with no public footage (Copilot, PointClickCare, MapStore, the offshore wind simulation) and the AI stack diagram. Each one is labeled "illustration" or "diagram" on the page. |
| `public/media/` | self-hosted media (the Dots and Scout demos, the Suelo site recording, the Career Compass clip, the trimmed Recall and UberX Share card clips, the offshore wind report figures, and their posters) |
| `research/arabic-dialects/` | the benchmark behind the Arabic dialects post: harness, prompts, raw replies and scores. The post's "Method, code and data" section explains it and lists every file (`src/components/ResearchFiles.astro`), and the old `/research/arabic-dialects/` page redirects there |
| `scripts/sync-research.mjs` | runs before `dev` and `build`, publishing the benchmark files under `/research/arabic-dialects/` (the AraDiCE question text is left out, `fetch_data.py` downloads it) |

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
  kind: youtube      # or video (src, poster, frame: none|phone, fit, start), demo (name), image (src, alt)
  id: VIDEO_ID
  title: Video title
  hd: true           # use the max-res YouTube thumbnail when it exists
metrics:
  - value: 30%
    label: what moved
---
```

Optional fields: `caseStudy: false` shows the entry as a card only, with no page behind it (Scout and Career Compass work this way), and `badge` adds a short label to the card, like Suelo's "more coming soon".

MDX bodies can import `VideoBlock`, `Figure`, `DemoBlock`, `FacebookVideo` and `BarChart` from `src/components/`.

### The case study bar

A case study ships only if it clears this bar. Check it whenever you add or edit one.

1. **Lead with the result.** The summary says what Malak owned and what changed, with a number, in two sentences or fewer.
2. **Only verified numbers.** Every metric comes from the accomplishment bank (`career/resume/experience/experience.md` in protos), the resume or a public source, and keeps its exact meaning: a relative lift stays a relative lift, and a result stays attached to the program that produced it. Show two to four metrics, outcomes over activity. A case with one real outcome shows one rather than padding with counts.
3. **Decisions, not task lists.** The body runs from the problem, to the calls she made and the reasoning behind each, to what happened, to what she learned.
4. **Clear ownership.** Say what she owned and who she worked with, and credit team results to the team.
5. **Real evidence.** Use public footage or figures where they exist, and label illustrations as illustrations.
6. **Short.** About three minutes to read. Cut anything that doesn't support a decision or a result.
7. **Passes `npm run style`.**

Not everything needs a case study. Work that can't clear the bar, and community roles like BridgeTO, live on the about page instead, and a project worth telling as a story can go in `src/content/writing/`, the way the 2024 offshore wind simulation is an engineering case study post.

## Media sources

- **Dots and Scout**: demo videos and screens copied from [ericdachen.com/design](https://ericdachen.com/design), from the projects Malak built with Eric Chen.
- **Career Compass**: a 17-second cut of Malak's own screen recording (September 2025), with the landing page, the analysis steps and a sample pathway. Her email was patched out of the results header, and the recording's login, postal code and LinkedIn pages aren't used.
- **Quine**: the official [Microsoft Research announcement](https://www.microsoft.com/en-us/research/blog/introducing-quine-an-ai-research-system-designed-for-the-complexity-of-biology/) video (YouTube) and figure animations, embedded from microsoft.com rather than re-hosted.
- **Recall**: the official Windows video, Microsoft ExpertZone's retail video, and the first-run screenshot from the Windows Insider Blog, all embedded from their sources. The home card loops a 12-second cut of the Windows video (3.1s to 15.4s, product footage only) as a self-hosted MP4, so YouTube's player overlay never shows.
- **UberX Share**: Uber's official launch video. The home card loops a 20-second cut (23.5s to 43.8s, from the app close-up to the UberX Share title) the same way.
- **Suelo**: a scroll recording of Suelo's site, captured frame by frame from the local prototype build, plus screenshots of the site and its workbench. Every project shown is a sample.
- **Offshore wind post**: the workflow, profit and power figures come from the team's University of Waterloo report (2024). The animated illustration is built from the report's numbers.
- **Arabic dialects post**: every example reply is a real model output from `research/arabic-dialects/results/`, and the charts read `summary.json` directly.

YouTube embeds use `youtube-nocookie.com` and only load after a click.

## Writing style

`npm run style` runs every case study, post and page through the `malak-style` checker (no em dashes, no buzzwords, no hedges, concrete numbers, no semicolon chains, no runs of short sentences). It loads the checker from `~/.copilot/skills/malak-style/scripts/style_check.py`. Set `MALAK_STYLE_CHECK` to use a different copy.
