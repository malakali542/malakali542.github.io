// What the pixel cat says. The first line on a page is said on arrival, and the rest come up as it wanders.
// Lines are lowercase like the rest of the site's labels, and a page without its own lines gets the default ones.

const pages: Record<string, string[]> = {
  '/': ['welcome! poke around :)', 'the tiles are clickable, go on', 'psst, ask LLMalak anything. bottom right'],
  '/side/': ['this is the after-hours stuff', 'suelo is the newest one', 'career compass helps about 400 people a month'],
  '/writing/': ['grab a tea, these are long reads', 'the arabic dialects one has charts!'],
  '/ai/': ['this is how she builds with ai', 'she has more agents than i have lives'],
  '/about/': ["that's her! say hi", 'seattle, by way of waterloo'],
  '/work/quine/': ['biology, but faster', '50,000 gpu-hours. i nap for less', 'narrowing the search took one weekend'],
  '/work/multiplayer/': ['a group chat that learns', '100,000 sessions in one month!'],
  '/work/recall/': ['recall remembers everything. i mostly remember naps', 'try the search demo, it finds the jacket'],
  '/work/copilot-diagnostics/': ['it asks before it runs anything. good manners', 'read first, then write. smart'],
  '/work/copilot-trusted-answers/': ['no forum threads from 2019 in here', 'the judge has to agree with the experts'],
  '/work/uber/': ['two teams, one city', 'map queries got 40% faster. zoom zoom'],
  '/work/pointclickcare/': ['refills, but faster', 'one ui library for everyone'],
  '/work/dots/': ['go see your friends!', 'this one won a hackathon'],
};

const post = ['a good one. take your time', "i'll wait here while you read"];
const lost = ["i can't find this page either", 'the home page is a nice place to nap'];
const fallback = ['meow', 'poke me!'];

export const pokeLines = ['hehe', 'that tickles!', 'mrrp!', 'again?', 'purr'];
export const wakeLines = ['mrrp? oh, hi', '...five more minutes'];

export function linesFor(path: string, notFound = false): string[] {
  if (notFound) return lost;
  const key = path.endsWith('/') ? path : `${path}/`;
  return pages[key] ?? (key.startsWith('/writing/') ? post : fallback);
}
