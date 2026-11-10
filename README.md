# malak ali · portfolio

Personal site: case studies with video, a writing section, and an about page. Static [Astro](https://astro.build) 7 + MDX, no client framework. The JavaScript is small inline scripts for the theme toggle, the cursor, in-view video autoplay, click-to-load YouTube and the animated illustrations, plus LLMalak's matcher, which loads only when someone opens the chat.

## Run it

Requires Node 22.12+.

```bash
npm ci            # install exactly what's in the lockfile
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
| `src/content/work/*.mdx` | case studies. Frontmatter drives the home page tiles, metrics and facts. The body is MDX. |
| `src/content/writing/*.mdx` | blog posts (`title`, `dek`, `date`, `tags`). The date is what the site shows. |
| `src/content.config.ts` | the schema for both collections |
| `src/pages/index.astro` | the home page, which is also the work page: the statement, currently and previously, then two tile grids, **work** (`group: work`) and **on the side** (`group: building`). The entry named by `featureId` (Quine) gets a full-width tile at the top of its section, with the first sentence of its summary and its metrics. `/work/` redirects here. |
| `src/pages/about.astro` | about, experience timeline, community, honors |
| `src/pages/ai.astro` | how I use AI: models, orchestration, harnesses, skills, and what I built with them |
| `src/components/Header.astro`, `Footer.astro`, `StatusBar.astro` | the left rail (nav, or a breadcrumb and table of contents on case studies and posts), the mobile top bar, the say-hi line, and the bottom bar with the Seattle clock |
| `src/components/WorkTile.astro` | one tile on the home grid: media, then `name / role year`, plus the summary for entries with no case study |
| `src/components/Ask.astro`, `src/data/llmalak.ts`, `src/lib/llmalak.ts` | LLMalak, the chat in the bottom bar: the panel, the answers, and the matcher (see below) |
| `src/components/Cursor.astro` | the pink square cursor |
| `src/components/Media.astro` | renders a tile or hero from `kind: video \| youtube \| demo \| image` |
| `src/components/demos/` | animated illustrations for work with no public footage (Copilot, PointClickCare, MapStore, the multiplayer system, the offshore wind simulation) and two diagrams: Quine's learning loop and the AI stack. Each one is labeled "illustration" or "diagram" on the page, and each has a wide layout and a compact one for phones. |
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
order: 10            # position on the home grid, which alternates left and right columns
group: work          # work, or building to show it under "on the side"
summary: One or two sentences for the page lede, and for the tile when there's no case study.
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

Optional fields: `caseStudy: false` shows the entry as a tile only, with its summary underneath and no page behind it (Suelo, Career Compass and Scout work this way), and `badge` adds a short label to the tile, like Suelo's "more coming soon". Tile shapes live in the `ratios` map in `src/pages/index.astro`: mixing 16:10, 4:3 and 1:1 staggers the two columns, and illustrations always get 4:3 or taller.

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
- **Suelo**: a scroll recording of Suelo's site, captured frame by frame from the local prototype build. Every project shown is a sample.
- **Multiplayer AI**: an illustration of how the system works, not its interface. The team's sessions, code and screens aren't shown.
- **Quine's learning loop**: a diagram built from the numbers in the Quine case study.
- **Offshore wind post**: the workflow, profit and power figures come from the team's University of Waterloo report (2024). The animated illustration is built from the report's numbers.
- **Arabic dialects post**: every example reply is a real model output from `research/arabic-dialects/results/`, and the charts read `summary.json` directly.

YouTube embeds use `youtube-nocookie.com` and only load after a click.

## Look

- The layout borrows from [rachelchen.tech](https://www.rachelchen.tech): a fixed left rail where a pink square marks the current page, grained paper, a serif statement on the home page, square media tiles captioned `name / role year`, a table of contents on case studies and posts that follows your scroll, and a bottom bar with the time in Seattle. Under 900px the rail becomes a top bar.
- The pink square in the rail is one element (`.rail-dot`) that glides to the current item. Within a page it follows `aria-current`, which the scrollspy in `Base.astro` moves as you scroll, and straight away when you click. On the home page, "work" scrolls back up instead of reloading. Between pages the square moves through a cross-document view transition (`@view-transition` in `global.css`) while the page crossfades. Browsers without view transitions, and anyone who prefers reduced motion, get an instant switch. The contents list on case studies and posts has its own transition name, so its square fades in instead of gliding over from the menu.
- The pre-redesign site is tagged `portfolio-v1-classic` (source) and `site-v1-classic` (deployed). To restore it, run `git checkout portfolio-v1-classic -- portfolio`, commit, and deploy.
- Titles, headings and labels render lowercase through one rule in `src/styles/global.css`, so content can be written in normal case. Body text keeps its case.
- The accent is `#ff5757`, the color on Malak's resume. Small accent text uses `--accent-ink`, the same hue darkened to `#ba3a3a` so it keeps 4.5:1 contrast on the grained paper, and text on accent fills uses `--on-accent`. Dark mode uses `#ff5757` for both.
- Display type is [Fraunces](https://github.com/undercasetype/Fraunces) at weight 340 with its soft and wonky axes on (`font-variation-settings: 'SOFT' 100, 'WONK' 1` on `body`), which gives the italic its curly k. It's the full variable font, about 120KB plus 150KB for the italic, because the smaller subsets drop the optical-size axis and the wonky letters. The regular style is preloaded in `Base.astro`. Everything else is Inter, and IBM Plex Mono is only for code and the small labels inside illustrations.
- The home statement keeps "product + engineer hybrid" on one line (`.statement .keep`). On narrow phones its font size shrinks with the screen so the phrase still fits, down to about 20px at 280px wide.
- The cursor is a pink square that becomes a diamond on links, a "read →" pill over case study tiles, a "play" pill over videos and a caret in text fields. It only replaces the system cursor after the first mouse move, never on touch screens, and it hides over embedded players.
- The site icon is `public/favicon.svg`. `favicon.ico` and `apple-touch-icon.png` are rendered from it for older browsers and iOS home screens. When the icon changes, regenerate both and bump the `?v=` on its link in `Base.astro`, because browsers cache favicons for a long time.

## LLMalak

The "ask LLMalak" button in the bottom bar (or the `/` key) opens a chat that answers questions about Malak in her voice. It doesn't call a model: `src/lib/llmalak.ts` matches the question against the answers in `src/data/llmalak.ts` and replies with the best one, its sources and three follow-up questions, so it can't make anything up. Questions in Arabic get a reply in formal MSA and a pointer to the dialects benchmark. The conversation is kept in `sessionStorage`, so it survives clicking through to a source.

To add or change an answer, edit `src/data/llmalak.ts`:

- `keys` are the words and phrases that point to the answer. A phrase scores more than a single word, and a leading `!` marks a name (a project, company or place) that outweighs topic words. Plurals and verb forms are folded together, and a one-letter typo in a long word still counts.
- When two answers score the same, the one higher in the list wins, so keep the general answer for a topic above the specific ones.
- Every fact must already be on the site. `text` and `ask` strings go through the style gate like any page, one answer per line.
- Chips call their answer by id, so a chip always gets the answer it names.

## Writing style

`npm run style` runs every case study, post, page and LLMalak answer through the `malak-style` checker (no em dashes, no buzzwords, no hedges, concrete numbers, no semicolon chains, no runs of short sentences). It loads the checker from `~/.copilot/skills/malak-style/scripts/style_check.py`. Set `MALAK_STYLE_CHECK` to use a different copy.
