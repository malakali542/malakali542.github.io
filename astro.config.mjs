import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://malak.club',
  integrations: [mdx(), sitemap()],
  // Old URLs: the benchmark's research page now lives at the end of its post, the offshore wind
  // project moved to writing, and removed pages fall back to their index.
  redirects: {
    '/research/arabic-dialects': '/writing/arabic-dialects-benchmark/#method-code-and-data',
    '/work/offshore-wind': '/writing/offshore-wind-newfoundland/',
    '/work/scout': '/work/',
    '/work/bridgeto': '/about/#community',
    '/writing/most-people-dont-use-ai-the-way-we-do': '/writing/',
  },
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
