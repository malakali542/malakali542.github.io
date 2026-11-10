// LLMalak answers questions about Malak using only what's on this site, and links its sources.
// Each answer lists the words and phrases that point to it. Phrases count more than single words,
// and a leading "!" marks a name (a project, company or place) that should outweigh topic words.
// When scores tie, the answer that comes first in this list wins, so general answers sit above
// the specific ones in each cluster. Links use [label](href).
// Every "text" and "ask" string runs through the style gate (scripts/style_gate.py).

export interface Source {
  label: string;
  href: string;
}

export interface Answer {
  id: string;
  // The question, as a suggestion chip.
  ask: string;
  keys: string[];
  text: string;
  // An Arabic line shown above the reply, right to left.
  ar?: string;
  sources?: Source[];
  // Follow-up suggestions, by id.
  next?: string[];
}

const quine = { label: 'quine', href: '/work/quine/' };
const recall = { label: 'recall', href: '/work/recall/' };
const diagnostics = { label: 'copilot diagnostics', href: '/work/copilot-diagnostics/' };
const trusted = { label: 'trusted answers', href: '/work/copilot-trusted-answers/' };
const uber = { label: 'uberx share', href: '/work/uber/' };
const pcc = { label: 'pointclickcare', href: '/work/pointclickcare/' };
const about = { label: 'about', href: '/about/' };
const ai = { label: 'how i use ai', href: '/ai/' };
const side = { label: 'on the side', href: '/#side' };
const arabic = { label: 'arabic dialects benchmark', href: '/writing/arabic-dialects-benchmark/' };
const science = { label: 'ai for science', href: '/writing/why-every-ai-lab-is-betting-on-science/' };
const multiplayer = { label: 'multiplayer ai', href: '/work/multiplayer/' };

export const answers: Answer[] = [
  {
    id: 'now',
    ask: "what are you working on?",
    keys: ['now', 'current', 'currently', 'today', 'these days', 'lately', 'working on', 'work on', 'job', 'role', 'position', 'title', 'day job', 'what do you do', 'focus', 'collaboration', 'ai for science and collaboration'],
    text: "I'm working on AI for science and collaboration at Microsoft Research. For science, I'm the research product manager on [Quine](/work/quine/), a world model of biology plus a harness that connects it to scientific tools, the literature and the wet lab, and I decide what the model learns next. For collaboration, I'm defining a [multiplayer, self-improving system](/work/multiplayer/) that teams build together, now used by 300+ people across 5+ teams.",
    sources: [quine, multiplayer],
    next: ['multiplayer', 'quine-metrics', 'evals'],
  },
  {
    id: 'multiplayer',
    ask: "what's the multiplayer ai system?",
    keys: ['!multiplayer', 'multi player', 'self improving', 'self improve', 'recursive', 'recursively', '!collaboration', 'team', 'teams', 'teammate', 'teammates', 'teamwork', 'session', 'sessions', 'shared', 'share', 'org wide', 'org', 'adoption', 'adopt', '300', 'platform', 'workspace', 'ai era', 'work as a team', 'together', 'code base', 'codebase'],
    text: "Most AI tools are single-player, so I'm defining a multiplayer, self-improving system for teams. Teammates see each other's sessions and build on each other's work, anyone who uses it can change its code, and the system learns recursively. It started as one team's project and now runs across 5+ teams and 300+ people in the org, and I design its product features and set the vision for where it goes.",
    sources: [multiplayer],
    next: ['now', 'ai-stack', 'quine'],
  },
  {
    id: 'quine',
    ask: "what is quine?",
    keys: ['!quine', '!microsoft research', 'msr', 'biology', 'biological', 'bio', 'world model', 'drug discovery', 'drug', 'protein', 'genomics', 'cell', 'broad institute', 'pancreatic', 'cancer', 'harness', 'rlvr', 'mid training', 'post training', 'reinforcement learning'],
    text: "Quine is Microsoft Research's AI research system for biology. It pairs a large language model post-trained across 5 biological modalities with a harness that connects it to scientific tools, the literature and the wet lab. With collaborators at the Broad Institute, Quine ranked thousands of compounds by their predicted ability to shift pancreatic cancer cells between states, and narrowing the search took one weekend.",
    sources: [quine, { label: 'microsoft research blog', href: 'https://www.microsoft.com/en-us/research/blog/introducing-quine-an-ai-research-system-designed-for-the-complexity-of-biology/' }],
    next: ['quine-metrics', 'quine-role', 'biosafety'],
  },
  {
    id: 'quine-metrics',
    ask: "what's your impact on quine?",
    keys: ['!quine', 'impact', 'result', 'metric', 'number', 'outcome', 'achievement', 'accomplishment', 'pass rate', 'gpu hours', 'held out', 'iteration', 'scientists'],
    text: "Turning partner failures into training data raised partner benchmark pass rates 15% over three model iterations, and the team's first RLVR program lifted held-out task accuracy 12%. For the 100+ scientists using Quine, time from a research question to an experimental plan dropped 30%. I direct 50,000+ GPU-hours across mid-training and RL for a core team of 8 and 30+ contributors.",
    sources: [quine],
    next: ['evals', 'quine-role', 'biosafety'],
  },
  {
    id: 'quine-role',
    ask: "what do you own on quine?",
    keys: ['!quine', 'you own', 'do you own', 'what you own', 'owner', 'ownership', 'responsible', 'responsibility', 'scope', 'roadmap', 'capability', 'capabilities', 'dataset', 'data', 'compute', 'gpu', 'workbench', 'decide', 'decision'],
    text: "I own the decisions around the training runs: which capabilities matter, how we'll know the model has them, what data and compute that takes, and when a checkpoint is ready for scientists. That covers the capability roadmap, the evals, 40+ internal and external datasets, 50,000+ GPU-hours of compute, the research workbench scientists use, and biosafety.",
    sources: [quine],
    next: ['evals', 'biosafety', 'quine-metrics'],
  },
  {
    id: 'biosafety',
    ask: "how do you handle biosafety?",
    keys: ['biosafety', 'safety', 'safe', 'misuse', 'harm', 'harmful', 'release gate', 'release criteria', 'responsible ai', 'red team', 'filtering', 'dual use', 'risk'],
    text: "A model good enough to help design a useful protein can help design a harmful one, so biosafety is a release gate for Quine. I'm the program and product lead for it, and with policy, research, engineering and Microsoft's internal safety board I set up release criteria and a review process now used across Microsoft research teams and 20+ models. The review caught a case where model outputs could be combined with public data to enable misuse, which changed a release decision and led to new output filtering.",
    sources: [quine, science],
    next: ['quine', 'evals', 'ai-for-science'],
  },
  {
    id: 'evals',
    ask: "how do you run evals?",
    keys: ['eval', 'evals', 'evaluation', 'evaluate', 'judge', 'llm as judge', 'measure', 'measuring', 'test', 'testing', 'grader', 'rubric', 'pharma', 'fortune 500'],
    text: "I write evals from what scientists actually do. On Quine I ran evaluation programs with research labs and five Fortune 500 pharma R&D partners, and every real-world failure became new mid-training data or a new RL task. On commercial Copilot I built the [LLM-as-judge evals](/work/copilot-trusted-answers/) that decided when an answer was good enough to ship, and on my own time I ran an [Arabic dialects benchmark](/writing/arabic-dialects-benchmark/) on my laptop.",
    sources: [quine, trusted],
    next: ['quine-metrics', 'trusted', 'arabic'],
  },
  {
    id: 'microsoft-ai',
    ask: "what did you do at microsoft ai?",
    keys: ['!microsoft', 'microsoft ai', 'mai', 'windows ai'],
    text: "I've been at Microsoft since 2024. Today I'm a research product manager at Microsoft Research on [Quine](/work/quine/) and [multiplayer AI](/work/multiplayer/), and before that I spent almost 2 years as a product manager at Microsoft AI. There I led [Recall](/work/recall/)'s onboarding and retail launch, owned [Copilot diagnostics](/work/copilot-diagnostics/), and grounded [commercial Copilot](/work/copilot-trusted-answers/) in trusted sources with evals that decided when an answer was ready to ship.",
    sources: [recall, diagnostics, trusted],
    next: ['recall', 'diagnostics', 'trusted'],
  },
  {
    id: 'recall',
    ask: "what did you ship on recall?",
    keys: ['!recall', 'windows recall', '!copilot pc', 'windows', 'onboarding', 'first run', 'retail', 'store', 'in store', 'demo', 'opt in', 'conversion', 'snapshot', 'privacy', 'security', 'guardrail', 'classifier', 'insider'],
    text: "I led Recall's onboarding and its retail launch. Letting people try Recall before committing raised opt-in 15%, and the in-store demo reached 30M+ interactions a month at a 2.5% sales conversion. I also built guardrails into the release, with risk classifiers at a 98% true positive rate and 0.95 F1, and Recall went from Insider preview in November 2024 to general availability in April 2025.",
    sources: [recall],
    next: ['recall-research', 'diagnostics', 'trusted'],
  },
  {
    id: 'recall-research',
    ask: "how did you work with ux research?",
    keys: ['ux research', 'user research', 'uxr', 'user study', 'user studies', 'usability', 'prototype', 'prototyping', 'experiment', 'experiments', 'designers', 'design partners', 'data science'],
    text: "On Recall I ran 10+ experiments on the first-run flow with UX research, design and our data science partners, and one change stood out: letting people try Recall before committing to it. I also ran my own user studies, and to test ideas before asking engineering to build them, I built working interfaces myself with AI prototyping tools and put them in front of users.",
    sources: [recall],
    next: ['recall', 'ai-stack', 'hybrid'],
  },
  {
    id: 'diagnostics',
    ask: "what is copilot diagnostics?",
    keys: ['!copilot diagnostics', 'diagnostic', 'diagnostics', 'troubleshoot', 'troubleshooting', 'fix', 'fixing', 'broken', 'pc', 'local code', 'code execution', 'run code', 'execute', 'copilot tasks', 'consent', 'system diagnostics', '10m'],
    text: "Copilot couldn't fix PCs because it couldn't see them. I owned diagnostics in Copilot Tasks, which lets Copilot write a diagnostic, run it on your PC with your consent, read the output and reason from what it actually found. It shipped to 10M+ Windows Copilot users, and I owned the product definition, consent flows, model readiness and guardrails.",
    sources: [diagnostics],
    next: ['trusted', 'recall', 'ai-stack'],
  },
  {
    id: 'trusted',
    ask: "how did you make copilot answers trustworthy?",
    keys: ['trusted', 'trusted sources', 'trusted answers', 'trustworthy', 'copilot answers', 'commercial', 'commercial copilot', 'enterprise', 'grounding', 'grounded', 'sources', 'citation', 'citations', 'it admin', 'admin', 'search', 'web search', 'rag', 'retrieval', 'session success', 'applied science', 'answer quality'],
    text: "When an IT admin asks Copilot how to configure something across a fleet of laptops, a wrong answer has a cost, because they act on it. I grounded commercial Copilot in trusted sources and built the LLM-as-judge evals, with Applied Science, that decided when an answer was good enough to ship. Session success went up 7 points.",
    sources: [trusted],
    next: ['evals', 'diagnostics', 'bot'],
  },
  {
    id: 'copilot',
    ask: "what did you do on copilot?",
    keys: ['!copilot'],
    text: "Two things. [Copilot diagnostics](/work/copilot-diagnostics/) lets Copilot write and run code on your PC, with your consent, to find out what's wrong, and it shipped to 10M+ Windows Copilot users. For [commercial Copilot](/work/copilot-trusted-answers/) I grounded answers in trusted sources and built the evals that decided when an answer was good enough to ship, which raised session success 7 points.",
    sources: [diagnostics, trusted],
    next: ['diagnostics', 'trusted', 'recall'],
  },
  {
    id: 'uber',
    ask: "what did you do at uber?",
    keys: ['!uber', 'uberx', 'uberx share', 'shared ride', 'shared rides', 'rideshare', 'ride', 'rider', 'cancel', 'cancellation', 'server driven', 'server driven ui', 'sdui', 'new york', 'ride matching', 'matching', 'adoption', 'market'],
    text: "I was a software engineer on UberX Share in New York. I built rider flows that explain shared rides before people cancel over them, ran opt-in experiments that lifted shared-ride adoption 4.5%, and cut MapStore's average query time 40%. I also onboarded server-driven UI to our microservice so we could change flows without an app release, then pitched it to the wider shared rides and ride matching org.",
    sources: [uber],
    next: ['mapstore', 'pointclickcare', 'hybrid'],
  },
  {
    id: 'mapstore',
    ask: "how did you make mapstore 40% faster?",
    keys: ['!mapstore', 'map store', 'map', 'query', 'sql', 'pagination', 'paginate', 'paginated', 'payload', 'latency', 'performance', 'optimize', 'optimization', 'faster', 'speed', 'slow', '40'],
    text: "MapStore is an internal Uber service other engineering teams use for map data. I redesigned its service interface and query architecture: paginated responses that used to return entire result sets, rewrote the slowest SQL queries, and trimmed payloads so the tools built on it loaded faster. Average query time dropped 40% for the teams that depend on it.",
    sources: [uber],
    next: ['uber', 'pointclickcare', 'hybrid'],
  },
  {
    id: 'pointclickcare',
    ask: "what did you build at pointclickcare?",
    keys: ['!pointclickcare', 'point click care', '!pcc', 'provider portal', 'portal', 'ui library', 'component library', 'component', 'design system', 'ci', 'pipeline', 'build time', 'healthcare', 'health care', 'senior care', 'long term care', 'frontend', 'front end'],
    text: "PointClickCare makes healthcare software for senior care, and I was a software engineer on its provider portal. I built the portal's shared UI component library, one library instead of many copies, and cut the team's CI pipeline time 30%.",
    sources: [pcc],
    next: ['uber', 'hybrid', 'microsoft-ai'],
  },
  {
    id: 'enlighted',
    ask: "what did you do at enlighted?",
    keys: ['!enlighted', '!siemens', 'iot', 'internet of things', 'hardware', 'asset tracking', 'tag', 'b2b', 'location intelligence', 'sensor', 'go to market'],
    text: "In 2023 I was a product manager at Enlighted, an IoT company Siemens acquired. I launched location-intelligence and asset-tracking tags for its B2B IoT platform, across hardware, software and go-to-market.",
    sources: [{ label: 'experience', href: '/about/#experience' }],
    next: ['microsoft-ai', 'hybrid', 'uber'],
  },
  {
    id: 'hybrid',
    ask: "are you an engineer or a pm?",
    keys: ['engineer or pm', 'engineer or a pm', 'pm or engineer', 'engineer or product', 'hybrid', 'engineer', 'engineering', 'technical', 'pm', 'product manager', 'product management', 'code', 'coding', 'write code', 'developer', 'swe', 'both', 'switch', 'transition'],
    text: "Both. At PointClickCare and Uber I shipped production code, which is still how I read a design doc: what breaks, who gets paged, how long it takes to load. At Microsoft AI I moved into product and spent almost 2 years on Recall and Copilot, and I still build, now mostly with agents, as my [AI page](/ai/) shows.",
    sources: [about, ai],
    next: ['ai-stack', 'uber', 'recall'],
  },
  {
    id: 'built',
    ask: "what do you build on the side?",
    keys: ['side project', 'side projects', 'on the side', 'side', 'startup', 'founder', 'cofounder', 'co founder', 'hackathon', 'build', 'built', 'building', 'project', 'projects', 'entrepreneur'],
    text: "I co-founded [Suelo](/#suelo), which builds agents that research candidate sites for real estate developers, and before that [Scout](/#scout), a search engine for your personal data. I built [Career Compass](/#career-compass) for newcomers to Ontario, which about 400 people use each month, and won the UXL 2024 hackathon with [Dots](/work/dots/).",
    sources: [side],
    next: ['suelo', 'career-compass', 'dots'],
  },
  {
    id: 'suelo',
    ask: "what is suelo?",
    keys: ['!suelo', '!swiftzone', 'swift zone', 'real estate', 'land', 'land acquisition', 'site selection', 'zoning', 'diligence', 'property'],
    text: "Suelo builds agents that research candidate sites for real estate developers and prepare the next round of diligence. I co-founded it as SwiftZone, and we've since narrowed it to the first decision in development, whether a site is worth pursuing. More is coming soon.",
    sources: [{ label: 'suelo', href: '/#suelo' }],
    next: ['built', 'scout', 'ai-stack'],
  },
  {
    id: 'career-compass',
    ask: "what is career compass?",
    keys: ['!career compass', 'compass', 'immigrant', 'immigration', 'newcomer', 'ontario', 'guelph', 'settlement', 'municipal', 'municipality', 'pathway', 'licensing', 'credential', 'mau', 'monthly users'],
    text: "I built Career Compass with Immigrant Services Guelph-Wellington so immigrant services in Ontario municipalities have a first line of support for newcomers. It translates international experience into local terms, maps local demand and salary, and lays out next steps like licensing with their cost and time. About 400 people use it each month.",
    sources: [{ label: 'career compass', href: '/#career-compass' }],
    next: ['built', 'community', 'suelo'],
  },
  {
    id: 'scout',
    ask: "what was scout?",
    keys: ['!scout', 'personal search', 'personal data', 'search engine', 'y combinator', 'yc', 'antler', 'pear', 'neo', 'accelerator', 'investor', 'vc', 'fundraise', 'fundraising'],
    text: "Scout was our startup, a unified search engine for personal data with a home screen that pulls your calendar, focus timer and news into one place. We took it from idea to MVP and interviewed with Y Combinator, Neo, Pear VC and Antler.",
    sources: [{ label: 'scout', href: '/#scout' }],
    next: ['suelo', 'dots', 'built'],
  },
  {
    id: 'dots',
    ask: "what is dots?",
    keys: ['!dots', 'uxl', 'hackathon', 'loneliness', 'lonely', 'friend', 'friends', 'maple mavericks', 'eric chen', 'eric', 'plan', 'plans', 'hangout', 'win', 'won', 'winner'],
    text: "Dots fights loneliness by turning your friends' free time into plans, and it won the UXL 2024 hackathon. I built it with Eric Chen and our team, Maple Mavericks, and my focus was user research, prototyping and motion.",
    sources: [{ label: 'dots', href: '/work/dots/' }],
    next: ['built', 'scout', 'recall-research'],
  },
  {
    id: 'ai-for-science',
    ask: "why is every ai lab betting on science?",
    keys: ['ai for science', 'science', 'scientific', 'deepmind', 'google deepmind', 'anthropic', 'openai', 'lab', 'labs', 'every lab', 'discovery', 'bottleneck', 'wet lab', 'lab bench', 'isomorphic', 'hassabis', 'demis', 'betting', 'bet', 'hypothesis', 'kosmos', 'edison'],
    text: "Google DeepMind, Anthropic, OpenAI and Microsoft have reached the same hypothesis, that AI can compress decades of scientific progress into years. I think it's right, and that the bottleneck is the lab bench: a model can propose a thousand hypotheses in an afternoon, but each one still has to be tested, and those experiments take weeks to years. I make the full case in [why every major AI lab is betting on science](/writing/why-every-ai-lab-is-betting-on-science/).",
    sources: [science],
    next: ['quine', 'biosafety', 'agents'],
  },
  {
    id: 'agents',
    ask: "what's your take on agents?",
    keys: ['agent', 'agentic', 'agent economy', 'agent to agent', 'two agents', 'commerce', 'shopping', 'shop', 'buyer', 'seller', 'loyal', 'loyalty', 'independent', 'payments', 'ap2', 'marketplace'],
    text: "When agents start shopping for us, the seller already has representation and the buyer often doesn't. I think the agent economy needs a buyer's side, plus someone independent to check that your agent stays loyal to you, the way card networks and auditors do for commerce today. I wrote it up in [two agents, one owner](/writing/two-agents-one-owner/).",
    sources: [{ label: 'two agents, one owner', href: '/writing/two-agents-one-owner/' }],
    next: ['ai-stack', 'writing', 'trusted'],
  },
  {
    id: 'arabic',
    ask: "what did your arabic benchmark find?",
    keys: ['!arabic', 'dialect', 'dialects', 'egyptian', 'levantine', 'msa', 'benchmark', 'multilingual', 'language', 'languages', 'translation', 'aradice', 'open models', 'gulf', 'moroccan', 'middle east'],
    text: "I asked four open models the same 200 questions in English, MSA, Egyptian and Levantine, then asked them for everyday help in four dialects. They understand less in dialect, and they almost never answer in one. It ran on my laptop, more than 900 prompts per model, and the code and data are at the end of [the post](/writing/arabic-dialects-benchmark/#method-code-and-data).",
    sources: [arabic],
    next: ['evals', 'writing', 'ai-stack'],
  },
  {
    id: 'offshore',
    ask: "what was the offshore wind project?",
    keys: ['!offshore', 'wind', 'wind farm', 'newfoundland', 'labrador', 'simulation', 'simulate', 'agent based', 'energy', 'renewable', 'turbine', 'capstone', 'bay'],
    text: "At the University of Waterloo my team simulated 25 years of offshore wind operations in two Newfoundland bays, one day at a time, to site the province's first offshore wind farm. We recommended the bay that earned less, and [the case study](/writing/offshore-wind-newfoundland/) explains why.",
    sources: [{ label: 'offshore wind case study', href: '/writing/offshore-wind-newfoundland/' }],
    next: ['education', 'writing', 'hybrid'],
  },
  {
    id: 'writing',
    ask: "what do you write about?",
    keys: ['writing', 'write', 'writer', 'blog', 'post', 'posts', 'essay', 'essays', 'article', 'articles', 'read', 'reading', 'substack', 'publish', 'newsletter'],
    text: "AI for science, agents, evals and how well language models speak Arabic. Start with [why every major AI lab is betting on science](/writing/why-every-ai-lab-is-betting-on-science/), [two agents, one owner](/writing/two-agents-one-owner/) on the agent economy, or [ask in Egyptian, get answered in MSA](/writing/arabic-dialects-benchmark/), my Arabic dialects benchmark.",
    sources: [{ label: 'writing', href: '/writing/' }],
    next: ['ai-for-science', 'agents', 'arabic'],
  },
  {
    id: 'ai-stack',
    ask: "how do you use ai?",
    keys: ['how do you use ai', 'use ai', 'use agents', 'ai stack', 'stack', 'tool', 'tools', 'claude', 'claude code', 'gpt', 'codex', '!copilot cli', '!github copilot', 'swarm', 'swarms', 'orca', 'orchestrator', 'local model', 'model', 'models', 'qwen', 'gemma', 'phi', 'llama', 'hermes', 'capy', 'skill', 'skills', 'subscription', 'subscriptions', 'workflow', 'productivity', 'coding agents', 'worktree', 'lifeos', 'quantdesk', 'automation', 'automate'],
    text: "Claude and GPT do my hard reasoning and most of my coding through Claude Code, Codex and GitHub Copilot CLI, while Qwen, Gemma and Phi run on my MacBook for bulk runs and private data. I run swarms of coding agents on an orchestrator I built on Orca, each in its own git worktree, and use Capy and Hermes for recursive self-improvement. With skills I wrote on top, I've replaced about half of my consumer subscriptions, and [my AI page](/ai/) has the full setup.",
    sources: [ai],
    next: ['site', 'fun', 'arabic'],
  },
  {
    id: 'site',
    ask: "how did you build this site?",
    keys: ['this site', 'site', 'website', 'portfolio', 'astro', 'built this', 'made this', 'design', 'designed', 'cursor', 'font', 'theme', 'dark mode', 'source code', 'em dash', 'style checker'],
    text: "I built it with coding agents in one of my Orca worktrees, on Astro, and every page went through my own style checker before it shipped. Even my answers here had to pass it, so you won't find an em dash anywhere.",
    sources: [ai],
    next: ['bot', 'ai-stack', 'fun'],
  },
  {
    id: 'bot',
    ask: "are you a real llm?",
    keys: ['are you real', 'are you a bot', 'are you ai', 'are you an ai', 'are you human', 'are you an llm', 'real llm', 'is this ai', 'is this real', 'bot', 'chatbot', 'llm', '!llmalak', 'language model', 'chatgpt', 'how does this work', 'how do you work', 'how does it work', 'made up', 'hallucinate', 'hallucination', 'who made you', 'who built you', 'prompt'],
    text: "No, despite the name. LLMalak matches your question to answers I wrote from my case studies, posts and resume, and it links the sources, so it can't make anything up. That's the idea behind my [trusted answers work](/work/copilot-trusted-answers/) on Copilot: answers grounded in sources you can check.",
    sources: [trusted],
    next: ['trusted', 'site', 'now'],
  },
  {
    id: 'community',
    ask: "what's bridgeto?",
    keys: ['!bridgeto', 'bridge to', 'teach', 'teaching', 'teacher', 'kid', 'kids', 'youth', 'student', 'students', 'mentor', 'mentoring', 'volunteer', 'volunteering', 'community', 'amazon', 'music', 'python', 'curriculum', 'toronto', 'give back', 'nonprofit'],
    text: "Since 2020 I've been the tech director and a mentor at BridgeTO Youth, where we teach Toronto youth to code by remixing music in Python, in collaboration with Amazon. I build the curriculum and run the hackathons, and I've been the marketing lead since 2021.",
    sources: [{ label: 'community', href: '/about/#community' }],
    next: ['fun', 'honors', 'education'],
  },
  {
    id: 'honors',
    ask: "any awards?",
    keys: ['award', 'awards', 'honor', 'honors', 'honour', 'scholarship', 'scholarships', 'obama', 'barack obama', 'grace hopper', 'ghc', 'recognition', 'prize', 'accolade'],
    text: "In 2020 Google sent me to the Grace Hopper Celebration on a scholarship, and I was a youth leader at Future Skills: A Conversation with President Barack Obama, hosted by the Economic Club of Canada. I've also received scholarships from the University of Waterloo, the University of Guelph and the Muslim Award of Excellence.",
    sources: [{ label: 'honors', href: '/about/#honors' }],
    next: ['education', 'community', 'about'],
  },
  {
    id: 'education',
    ask: "where did you study?",
    keys: ['education', 'school', 'university', 'uni', 'college', 'waterloo', 'uwaterloo', 'degree', 'study', 'studied', 'major', 'minor', 'systems design', 'systems design engineering', 'graduate', 'grad', 'alma mater', 'basc'],
    text: "I studied Systems Design Engineering at the University of Waterloo, with minors in management science and computing.",
    sources: [{ label: 'experience', href: '/about/#experience' }],
    next: ['offshore', 'honors', 'hybrid'],
  },
  {
    id: 'fun',
    ask: "what do you do for fun?",
    keys: ['fun', 'for fun', 'hobby', 'hobbies', 'free time', 'spare time', 'outside', 'outside work', 'outside of work', 'weekend', 'game', 'games', 'tiny voyages', 'skyward', 'news digest', 'news', 'family', 'interest', 'interests', 'personal life', 'puzzle'],
    text: "I build software for my family and me: my own news digest, an investing desk that writes a brief on my watchlist every morning, and two daily games, Tiny Voyages and Skyward, so we get a new puzzle each day without another subscription. I also teach Toronto youth to code with [BridgeTO](/about/#community).",
    sources: [ai],
    next: ['ai-stack', 'community', 'site'],
  },
  {
    id: 'contact',
    ask: "how do i reach you?",
    keys: ['contact', 'email', 'mail', 'reach', 'reach you', 'linkedin', 'github', 'connect', 'get in touch', 'touch', 'message', 'dm', 'coffee', 'call', 'phone'],
    text: "Email is fastest: [malakali.tech@gmail.com](mailto:malakali.tech@gmail.com). I'm also on [LinkedIn](https://www.linkedin.com/in/-malakali/) and [GitHub](https://github.com/malakali542), and I'm based in Seattle.",
    sources: [about],
    next: ['hire', 'about', 'now'],
  },
  {
    id: 'hire',
    ask: "can we work together?",
    keys: ['hire', 'hiring', 'recruit', 'recruiter', 'recruiting', 'available', 'availability', 'opportunity', 'opportunities', 'open to work', 'open to', 'job offer', 'work together', 'work with you', 'collaborate', 'consult', 'consulting', 'contract', 'freelance', 'advisor', 'advise', 'interview'],
    text: "If you're building models, evals, agents or other AI products, I'd like to hear about it. Email me at [malakali.tech@gmail.com](mailto:malakali.tech@gmail.com) with what you're working on.",
    sources: [about],
    next: ['contact', 'now', 'hybrid'],
  },
  {
    id: 'location',
    ask: "where are you based?",
    keys: ['based', 'live', 'living', 'located', 'location', 'seattle', 'city', 'where are you', 'timezone', 'time zone', 'relocate', 'clock'],
    text: "I'm based in Seattle, which is the clock you see at the bottom of the page. At Uber I worked on UberX Share in New York.",
    sources: [about],
    next: ['contact', 'now', 'education'],
  },
  {
    id: 'resume',
    ask: "where's your resume?",
    keys: ['resume', 'cv', 'timeline', 'work history', 'experience', 'career', 'past jobs', 'previous jobs', 'previously'],
    text: "My full timeline is on the [about page](/about/#experience): Microsoft Research, Microsoft AI, Enlighted, Uber and PointClickCare, plus my degree from the University of Waterloo. For anything more, [email me](mailto:malakali.tech@gmail.com).",
    sources: [about],
    next: ['about', 'hybrid', 'contact'],
  },
  {
    id: 'about',
    ask: "who are you?",
    keys: ['who are you', 'who is malak', 'about you', 'about yourself', 'yourself', 'introduce', 'introduction', 'bio', 'background', 'summary', 'tldr', 'tl dr', 'elevator pitch', 'malak', 'malak ali'],
    text: "I'm a product + engineer hybrid in Seattle working on AI for science and collaboration: I'm the research product manager on [Quine](/work/quine/) at Microsoft Research, and I'm defining a [multiplayer, self-improving system](/work/multiplayer/) for teams. Before that I was a product manager at Microsoft AI on [Recall](/work/recall/) and [Copilot](/work/copilot-diagnostics/), a product manager at Enlighted, which Siemens acquired, and a software engineer at [Uber](/work/uber/) and [PointClickCare](/work/pointclickcare/). I studied Systems Design Engineering at the University of Waterloo.",
    sources: [about],
    next: ['now', 'multiplayer', 'hybrid'],
  },
];

// Replies that don't come from matching.
export const greeting: Answer = {
  id: 'greeting',
  ask: "say hi",
  keys: [],
  text: "Hi! I'm Malak, or the version of me that lives on this site. Ask me about my work at Microsoft Research, Microsoft AI, Uber or PointClickCare, the things I build on the side, or anything I've written, and I'll link where each answer comes from.",
  next: ['now', 'hybrid', 'built'],
};

export const thanks: Answer = {
  id: 'thanks',
  ask: "thanks",
  keys: [],
  text: "Anytime. If you want to keep talking with the real me, email [malakali.tech@gmail.com](mailto:malakali.tech@gmail.com).",
  next: ['contact', 'writing', 'fun'],
};

// Asked in Arabic: answer in formal MSA, the way the models in the benchmark did.
export const inArabic: Answer = {
  id: 'arabic-reply',
  ask: "arabic",
  keys: [],
  ar: "مرحباً! يسعدني أن أجيب عن أسئلتك.",
  text: "You asked in Arabic, so I answered in formal MSA, which is what the four open models in my [Arabic dialects benchmark](/writing/arabic-dialects-benchmark/) did almost every time. Ask me in English and I can tell you about my work.",
  sources: [arabic],
  next: ['arabic', 'evals', 'writing'],
};

export const fallback: Answer = {
  id: 'fallback',
  ask: "something else",
  keys: [],
  text: "I only answer from what's on this site, and I don't have a good answer for that one yet. Try one of the questions below, or ask the real me at [malakali.tech@gmail.com](mailto:malakali.tech@gmail.com).",
  next: ['now', 'hybrid', 'ai-stack'],
};

export const more: Answer = {
  id: 'more',
  ask: "tell me more",
  keys: [],
  text: "Pick a thread below and I'll keep going.",
};

export const starters = ['now', 'multiplayer', 'hybrid', 'ai-stack', 'arabic', 'built'];
