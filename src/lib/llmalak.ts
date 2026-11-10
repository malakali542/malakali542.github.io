import { answers, fallback, greeting, inArabic, more, thanks, type Answer, type Source } from '../data/llmalak';

export interface Reply {
  id: string;
  text: string;
  ar?: string;
  sources: Source[];
  next: { id: string; ask: string }[];
}

const STOP = new Set(
  `a an the is are am was were be been being do does did doing you your yours u ur i im me my mine we our us it its
  this that these those there here what whats which who whom whose how why when where can could would should will
  shall may might must please tell say about of to in on at for with from by as and or but if so than then too very
  just also any some more most much many have has had get got give show explain describe know like into up out over
  again all one ok okay`.split(/\s+/),
);
const GREETINGS = new Set(['hi', 'hello', 'hey', 'heya', 'hiya', 'yo', 'sup', 'howdy', 'salam', 'salaam', 'hola', 'greetings', 'morning', 'evening', 'afternoon', 'good', 'there']);
const THANKS = new Set(['thanks', 'thank', 'thx', 'ty', 'cheers', 'appreciate', 'appreciated', 'great', 'cool', 'nice', 'awesome', 'perfect', 'amazing', 'love', 'it', 'that']);
const MORE = new Set(['more', 'tell', 'me', 'go', 'on', 'continue', 'elaborate', 'detail', 'details', 'else', 'keep', 'going', 'and', 'what']);

function stem(word: string): string {
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith('ed')) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']s\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter((w) => w.length > 1 || /\d/.test(w));
}

// Edit distance of at most 1, for typos in longer words.
function near(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

interface Key {
  text: string;
  phrase: boolean;
  weight: number;
}

// Keys that stem to the same text ("model", "models") count once, at their highest weight.
const prepared = answers.map((answer) => {
  const keys = new Map<string, Key>();
  for (const raw of answer.keys) {
    const name = raw.startsWith('!');
    const text = words(name ? raw.slice(1) : raw).map(stem).join(' ');
    const phrase = text.includes(' ');
    const weight = phrase ? (name ? 5 : 3) : name ? 4 : 2;
    if ((keys.get(text)?.weight ?? 0) < weight) keys.set(text, { text, phrase, weight });
  }
  return { answer, keys: [...keys.values()] };
});

const byId = new Map(answers.map((answer) => [answer.id, answer]));
for (const special of [greeting, thanks, inArabic, fallback, more]) byId.set(special.id, special);

function toReply(answer: Answer, next = answer.next ?? []): Reply {
  return {
    id: answer.id,
    text: answer.text,
    ar: answer.ar,
    sources: answer.sources ?? [],
    next: next.flatMap((id) => {
      const target = byId.get(id);
      return target ? [{ id, ask: target.ask }] : [];
    }),
  };
}

export function replyFor(id: string, next?: string[]): Reply | undefined {
  const answer = byId.get(id);
  return answer ? toReply(answer, next) : undefined;
}

export function reply(question: string, previous?: string): Reply {
  if (/[\u0600-\u06ff]/.test(question)) return toReply(inArabic);

  const all = words(question);
  if (all.length === 0) return toReply(fallback);
  if (all.every((w) => GREETINGS.has(w) || STOP.has(w) || w === 'malak') && all.some((w) => GREETINGS.has(w))) return toReply(greeting);
  if (all.every((w) => THANKS.has(w) || STOP.has(w)) && all.some((w) => THANKS.has(w) && !['it', 'that', 'love'].includes(w))) return toReply(thanks);
  if (all.every((w) => MORE.has(w) || STOP.has(w)) && all.some((w) => ['more', 'continue', 'elaborate', 'else', 'detail', 'details'].includes(w))) {
    const last = previous ? byId.get(previous) : undefined;
    return toReply(more, last?.next?.length ? last.next : fallback.next);
  }

  const stemmed = all.map(stem);
  const phrase = ` ${stemmed.join(' ')} `;
  const content = new Set(all.filter((w) => !STOP.has(w)).map(stem));

  let best: (typeof prepared)[number] | undefined;
  let bestScore = 0;
  for (const entry of prepared) {
    let score = 0;
    for (const key of entry.keys) {
      if (key.phrase) {
        if (phrase.includes(` ${key.text} `)) score += key.weight;
      } else if (content.has(key.text)) {
        score += key.weight;
      } else if (key.text.length >= 5 && [...content].some((w) => w.length >= 5 && (w.startsWith(key.text) || near(w, key.text)))) {
        // A typo or a longer form of the word: a name still counts, a topic word barely does.
        score += Math.max(1, key.weight - 1);
      }
    }
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return best && bestScore >= 2 ? toReply(best.answer) : toReply(fallback);
}
