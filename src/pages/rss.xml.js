import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  return rss({
    title: 'Pillexis Labs Blog',
    description:
      'Build logs, studio notes, and distribution diaries from a research-driven AI product studio.',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.slug}/`,
      categories: [post.data.pillar, ...post.data.tags],
    })),
    customData: '<language>en-us</language>',
  });
}
