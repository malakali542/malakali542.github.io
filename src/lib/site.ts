const email = 'malakali.tech@gmail.com';

export const site = {
  name: 'Malak Ali',
  title: 'malak ali',
  email,
  description:
    'Malak Ali is a product and engineer hybrid based in Seattle. She is a research product manager at Microsoft Research working on Quine and on a multiplayer, self-improving AI system used by 300+ people, and before that shipped Recall and Copilot features at Microsoft AI and was a software engineer at Uber and PointClickCare. University of Waterloo alum.',
  links: [
    { label: 'linkedin', href: 'https://www.linkedin.com/in/-malakali/' },
    { label: 'github', href: 'https://github.com/malakali542' },
    { label: 'email', href: `mailto:${email}` },
  ],
};

export function formatDate(date: Date, style: 'short' | 'long' = 'short'): string {
  return date
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: style === 'long' ? 'long' : 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
    .toLowerCase();
}

export function readingMinutes(text: string): number {
  const words = text
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export function youtubeThumb(id: string, hd = false): string {
  return `https://i.ytimg.com/vi/${id}/${hd ? 'maxresdefault' : 'hqdefault'}.jpg`;
}
