import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('writing')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'malak ali · writing',
    description: 'Essays on agents, evals and Arabic language AI.',
    site: context.site ?? site.links[0].href,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.dek,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
    })),
  });
}
