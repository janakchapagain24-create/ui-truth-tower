import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Circle, ExternalLink, Info, Lightbulb, Menu, Search, TriangleAlert, X } from "lucide-react";
import { Logo } from "@/components/oc/Logo";
import { ThemeToggle } from "@/components/oc/ThemeToggle";
import { AskAiBox } from "@/components/oc/AskAiBox";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "One Chance Docs — The story, product & Colosseum submission" },
      { name: "description", content: "GitBook-style docs for One Chance: why gambling harm is rising, one person's recovery story, the product, Solana architecture, blocker and roadmap." },
      { property: "og:title", content: "One Chance Docs — The story, product & Colosseum submission" },
      { property: "og:description", content: "How One Chance helps people step out of gambling: blockers, a trusted person, an AI coach, Solana commitments and a cheering community." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Docs,
});

/* ---------- building blocks ---------- */
const Box = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={`glass rounded-2xl p-5 ${className}`}>{children}</div>;
const P = ({ children }: { children: React.ReactNode }) => <p className="leading-relaxed text-muted-foreground">{children}</p>;
const H = ({ children }: { children: React.ReactNode }) => <h3 className="font-display pt-4 text-xl font-semibold">{children}</h3>;
function Callout({ kind = "info", children }: { kind?: "info" | "warn" | "tip"; children: React.ReactNode }) {
  const Icon = kind === "warn" ? TriangleAlert : kind === "tip" ? Lightbulb : Info;
  return <div className="glass flex gap-3 rounded-2xl border-l-4 border-l-primary p-4 text-sm"><Icon className="mt-0.5 size-4 shrink-0 text-primary" /><div className="leading-relaxed">{children}</div></div>;
}
const Quote = ({ children }: { children: React.ReactNode }) => <blockquote className="border-l-2 border-primary/60 pl-4 font-display text-lg italic">{children}</blockquote>;
const Grid = ({ children }: { children: React.ReactNode }) => <div className="grid gap-3 md:grid-cols-2">{children}</div>;
const Card = ({ t, d }: { t: string; d: string }) => <Box><p className="font-semibold">{t}</p><p className="mt-1 text-sm text-muted-foreground">{d}</p></Box>;

const SHOTS = [
  ["home", "Social home", "Stories, cheers and daily wins."], ["protect", "Protect", "Shields, trusted person, DNS profiles."],
  ["emergency", "Emergency pause", "Breathe, name the trigger, wait 20 min."], ["vault", "Solana Vault", "Devnet commitment signed on-chain."],
  ["rebuild", "Rebuild", "Debt plan with monthly installments."], ["coach", "AI Coach", "10 free messages a day."],
  ["games", "Games", "+20 credits for riding out an urge."], ["work", "Work", "Submit proof, get verified, earn."],
];
const ROADMAP: { phase: string; status: "done" | "next" | "later"; items: string[] }[] = [
  { phase: "Phase 1 · Foundation", status: "done", items: ["Design system, light & dark", "Emergency pause, missions, progress", "Games arcade"] },
  { phase: "Phase 2 · Protection & Web3", status: "done", items: ["AI Coach", "iPhone/Android DNS shields", "Debt planner + installments", "Solana Devnet Commitment Vault"] },
  { phase: "Phase 3 · Community", status: "done", items: ["Accounts & cross-device sync", "Live feed, cheers, comments", "Work submissions + reviewer"] },
  { phase: "Phase 4 · Colosseum sprint", status: "next", items: ["Anchor escrow (time-lock + guardian co-sign)", "Soulbound milestone badges", "Solana Blinks for cheers & grants"] },
  { phase: "Phase 5 · Launch", status: "later", items: ["Native iOS & Android blockers", "USDC work payouts", "Weekly AI review, mainnet"] },
];
const CHECK: [string, boolean][] = [
  ["Working app deployed", true], ["Solana Devnet integration (wallet + memo tx)", true], ["Public GitHub repo", false],
  ["3-minute pitch video", false], ["Technical demo video", false], ["Anchor escrow program on Devnet", false],
];

/* ---------- pages ---------- */
type Page = { id: string; group: string; title: string; body: React.ReactNode };
const PAGES: Page[] = [
  { id: "welcome", group: "Getting started", title: "Welcome to One Chance", body: <>
    <P>One Chance is a free recovery companion for people who want to stop gambling. It blocks betting, holds you accountable with a trusted person and an on-chain commitment, calms urges in the moment, and helps you rebuild money and confidence.</P>
    <Quote>"I can start again." — the one sentence every screen is built around.</Quote>
    <Grid><Card t="Protect" d="Block betting sites and apps, with a 48-hour wait before anything can be switched off." /><Card t="Pause" d="An emergency button that walks you through the worst ten minutes." /><Card t="Commit" d="Put skin in the game with a Solana commitment your trusted person can see." /><Card t="Rebuild" d="Debt plan, small paid work, and a community that cheers every safe day." /></Grid>
  </> },
  { id: "epidemic", group: "The story", title: "Gambling is everywhere now", body: <>
    <P>Ten years ago, betting meant going somewhere. Today it lives in the phone in your pocket — open at 2 a.m., in the bathroom at work, during your kid's football match. Sports betting has been legalised in more and more places, online casinos run nonstop, and new prediction markets and crypto casinos turn almost anything into a bet.</P>
    <P>Every app is designed to bring you back: push notifications, "free bets", boosted odds, celebrity ads, live in-play markets that let you bet again every few seconds. Advertising during sport has become constant, and young adults are growing up thinking a bet slip is part of watching the game.</P>
    <Callout kind="warn">Gambling harm is not just about money. It's linked to debt, broken relationships, lost jobs, anxiety, depression and — for some — thoughts of suicide. Most people suffering never ask for help, because of shame.</Callout>
    <H>Why the old tools fail</H>
    <Grid><Card t="Willpower runs out" d="Urges peak late at night, after drinking, after a loss. That's exactly when promises break." /><Card t="Blockers are one tap from off" d="Most can be uninstalled or disabled in under a minute during an urge." /><Card t="Recovery is lonely" d="Shame keeps people quiet. Without anyone noticing, a slip becomes a spiral." /><Card t="Debt keeps you stuck" d="The chase begins: 'one more win and I can fix it'. The debt grows instead." /></Grid>
  </> },
  { id: "spiral", group: "The story", title: "Marcus: the 2 a.m. spiral", body: <>
    <Callout>Marcus is a composite character, built from the common patterns people describe in recovery. His story is realistic, not a real person.</Callout>
    <P>Marcus is 28, works in a warehouse office, and loves football. It started with a small bet with friends to make a match more exciting. Then a welcome bonus. Then an app on his phone that always seemed to have a "boost" waiting.</P>
    <P>A year and a half later, Marcus is betting most nights. Not for fun anymore — to win back what he lost yesterday. He has four credit cards, a payday loan, and his partner Leila doesn't know. He deletes the apps every Sunday and reinstalls them by Wednesday.</P>
    <Quote>"I'd lie in bed with the screen on the lowest brightness so Leila wouldn't see. I'd tell myself: just this one, then I'm done."</Quote>
    <P>The night that changes everything is ordinary. He loses his rent money on a late game in another country he doesn't even care about. At 3 a.m. he sits in the kitchen and searches "how do I stop gambling". He finds One Chance.</P>
  </> },
  { id: "turning", group: "The story", title: "The turning point", body: <>
    <H>Day 1 — Walls that don't move</H>
    <P>Marcus installs the shield on his phone. Betting sites stop loading everywhere — every browser, every app that uses the web. He asks his brother Dan to be his trusted person. Now, if Marcus ever tries to turn protection off, he has to wait 48 hours, and Dan gets told. The 2 a.m. version of Marcus can't undo what the morning version decided.</P>
    <H>Day 2 — Skin in the game</H>
    <P>In the Vault, he signs a 30-day commitment on Solana and stakes a small amount with Dan as guardian. It's public proof of a private promise. For the first time, quitting feels like something he's <em>doing</em>, not just hoping.</P>
    <H>Day 9 — The urge</H>
    <P>A big match, a bad day, a beer. The old feeling comes. He taps "I'm about to gamble". The app slows him down: breathe for one minute, name the trigger (bored + stressed), then a 20-minute timer. He talks it out with the AI Coach, plays a few rounds of 2048, and the wave passes. He earns 20 credits for riding it out.</P>
    <Callout kind="tip">Urges usually rise, peak and fade within minutes. One Chance is designed to get people through those minutes.</Callout>
    <H>Day 17 — A slip, not a reset</H>
    <P>He slips once, on a site the blocker hadn't listed yet. He reports it, it gets added, and he logs the setback privately. His credits and progress stay. Nothing in One Chance punishes honesty.</P>
  </> },
  { id: "rebuild", group: "The story", title: "Rebuilding a life", body: <>
    <H>Day 30 — Telling the truth</H>
    <P>Marcus tells Leila everything. It's the hardest conversation of his life. They sit together with the Debt Planner: every card, every rate, a monthly budget. For the first time there's a date on the screen when he'll be debt-free, and a month-by-month schedule showing exactly what to pay.</P>
    <H>Day 45 — Small wins, out loud</H>
    <P>He posts "45 days. Paid off my first card." on the community feed. Strangers who've been there cheer him on. He completes a few work challenges to build skills and earn credits toward real paid tasks.</P>
    <H>Day 90 — A different person at 2 a.m.</H>
    <P>His commitment completes. His stake comes back. He keeps the shields on, by choice. Nights are for sleep again.</P>
    <Quote>"I didn't get one chance. I got one more chance. That's all I needed."</Quote>
    <Callout kind="warn">One Chance can't promise anyone will never gamble again. It makes the next safe day easier — and makes starting again always possible. If you're in crisis, please contact a local helpline or emergency services.</Callout>
  </> },
  { id: "tour", group: "Product", title: "Product tour", body: <>
    <P>Every screen below is live in the app today.</P>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {SHOTS.map(([f, t, d]) => <figure key={f} className="glass overflow-hidden rounded-2xl"><img src={`/docs/${f}.jpg`} alt={`${t} screen`} loading="lazy" className="aspect-[393/800] w-full object-cover object-top" /><figcaption className="p-3"><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></figcaption></figure>)}
    </div>
  </> },
  { id: "blocker", group: "Product", title: "Betting & casino blocker", body: <>
    <Grid><Card t="Today (web)" d="iPhone DNS profile, Android Private DNS and a hosts blocklist stop betting sites on the whole phone." /><Card t="48-hour cooldown" d="Turning protection off always waits 48 hours, and the trusted person is told." /><Card t="iPhone app (coming)" d="Apple Screen Time controls shield gambling apps and block new installs." /><Card t="Android app (coming)" d="Detects betting apps on open, shows a calm pause screen, filters betting traffic." /></Grid>
    <Callout>Native apps are in development. Early-access sign-ups are collected on the Protect page.</Callout>
  </> },
  { id: "solana", group: "Product", title: "Solana architecture", body: <>
    <Box className="font-mono text-xs leading-relaxed md:text-sm"><pre className="overflow-x-auto whitespace-pre">{`Wallet (Phantom / Solflare / Backpack)
   │  sign
   ▼
Commitment tx ──► Memo program  "one-chance:commit:30d"
   └─ optional stake ──► trusted person's wallet

Next (Anchor):
Vault PDA [user, start, days, guardian]
   ├─ unlock()  after milestone date  → back to user
   └─ release() guardian co-sign       → partner / charity`}</pre></Box>
    <Grid><Card t="Live now" d="Devnet wallet connect, test airdrop, signed commitments, explorer links." /><Card t="Soulbound badges" d="Compressed NFTs for Day 30/90/180 — proof without revealing identity." /><Card t="Blinks" d="Share a win on X; friends cheer or send a small grant." /><Card t="Privacy" d="No addiction status on-chain — only a commitment memo." /></Grid>
  </> },
  { id: "roadmap", group: "Colosseum", title: "Roadmap", body: <>
    <ol className="relative space-y-4 border-l border-border pl-6">
      {ROADMAP.map((r) => <li key={r.phase} className="relative"><span className={`absolute -left-[31px] top-5 size-3 rounded-full ${r.status === "done" ? "bg-primary" : r.status === "next" ? "bg-accent" : "bg-muted"}`} /><Box><div className="flex items-center justify-between"><p className="font-semibold">{r.phase}</p><span className="text-xs uppercase text-muted-foreground">{r.status === "done" ? "Shipped" : r.status === "next" ? "Next" : "Later"}</span></div><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{r.items.map((i) => <li key={i}>• {i}</li>)}</ul></Box></li>)}
    </ol>
  </> },
  { id: "checklist", group: "Colosseum", title: "Submission checklist", body: <>
    <Box><ul className="space-y-2">{CHECK.map(([t, ok]) => <li key={t} className="flex items-center gap-2 text-sm">{ok ? <Check className="size-4 text-primary" /> : <Circle className="size-4 text-muted-foreground" />}{t}</li>)}</ul></Box>
    <a href="https://arena.colosseum.org" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary">Colosseum Arena <ExternalLink className="size-3.5" /></a>
  </> },
];
const GROUPS = [...new Set(PAGES.map((p) => p.group))];

function Docs() {
  const [id, setId] = useState("welcome");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => { const h = window.location.hash.slice(1); if (PAGES.some((p) => p.id === h)) setId(h); }, []);
  const go = (n: string) => { setId(n); setOpen(false); history.replaceState(null, "", `#${n}`); window.scrollTo({ top: 0 }); };
  const idx = PAGES.findIndex((p) => p.id === id);
  const page = PAGES[idx];
  const shown = useMemo(() => PAGES.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())), [q]);

  const nav = (
    <div className="space-y-5">
      <label className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm"><Search className="size-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search docs" className="w-full bg-transparent outline-none" /></label>
      {GROUPS.map((g) => { const items = shown.filter((p) => p.group === g); if (!items.length) return null; return (
        <div key={g}><p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{g}</p>
          {items.map((p) => <button key={p.id} onClick={() => go(p.id)} className={`block w-full rounded-lg px-3 py-1.5 text-left text-sm ${p.id === id ? "bg-primary/15 font-medium text-primary" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"}`}>{p.title}</button>)}
        </div>); })}
    </div>
  );

  return (
    <div className="min-h-screen pb-40">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3"><button aria-label="Open menu" onClick={() => setOpen(true)} className="glass rounded-full p-2 lg:hidden"><Menu className="size-4" /></button><Link to="/"><Logo /></Link><span className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex"><BookOpen className="size-4" />Docs</span></div>
          <div className="flex items-center gap-2"><Link to="/app" className="glass rounded-full px-4 py-2 text-sm">Open app</Link><ThemeToggle /></div>
        </div>
      </header>

      {open && <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)}>
        <aside className="glass h-full w-72 overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}><button aria-label="Close menu" onClick={() => setOpen(false)} className="mb-4 ml-auto block"><X className="size-5" /></button>{nav}</aside>
      </div>}

      <div className="mx-auto flex max-w-7xl gap-10 px-5 pt-8">
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-64 shrink-0 overflow-y-auto lg:block">{nav}</aside>
        <main className="min-w-0 max-w-3xl flex-1 space-y-5">
          <p className="text-xs text-muted-foreground">One Chance Docs › {page.group} › <span className="text-foreground">{page.title}</span></p>
          <h1 className="font-display text-3xl font-semibold leading-tight md:text-5xl">{page.title}</h1>
          <article key={page.id} className="fade-up space-y-5">{page.body}</article>
          <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-6">
            {idx > 0 ? <button onClick={() => go(PAGES[idx - 1].id)} className="glass rounded-2xl p-4 text-left"><span className="flex items-center gap-1 text-xs text-muted-foreground"><ChevronLeft className="size-3" />Previous</span><span className="text-sm font-medium">{PAGES[idx - 1].title}</span></button> : <span />}
            {idx < PAGES.length - 1 && <button onClick={() => go(PAGES[idx + 1].id)} className="glass rounded-2xl p-4 text-right"><span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">Next<ChevronRight className="size-3" /></span><span className="text-sm font-medium">{PAGES[idx + 1].title}</span></button>}
          </div>
        </main>
      </div>
      <AskAiBox />
    </div>
  );
}
