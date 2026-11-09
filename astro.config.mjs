import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://malak.club',
  integrations: [mdx(), sitemap()],
  // The benchmark's research page now lives at the end of its post.
  redirects: {
    '/research/arabic-dialects': '/writing/arabic-dialects-benchmark/#method-code-and-data',
  },
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
