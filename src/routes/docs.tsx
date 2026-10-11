import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Circle, ExternalLink } from "lucide-react";
import { Logo } from "@/components/oc/Logo";
import { ThemeToggle } from "@/components/oc/ThemeToggle";
import { AskAiBox } from "@/components/oc/AskAiBox";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "One Chance — Colosseum Submission Docs" },
      { name: "description", content: "Pitch, product screenshots, Solana architecture, blocker design and roadmap for One Chance, a gambling-recovery platform." },
      { property: "og:title", content: "One Chance — Colosseum Submission Docs" },
      { property: "og:description", content: "Trustless recovery: Solana commitment vaults, betting blockers and an AI coach." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Docs,
});

const TOC = [["pitch", "Pitch"], ["problem", "Problem"], ["product", "Product"], ["solana", "Solana"], ["blocker", "Blocker"], ["roadmap", "Roadmap"], ["submission", "Checklist"]];

const SHOTS = [
  ["home", "Social home", "Stories, cheers and daily wins."],
  ["protect", "Protect", "Shields, trusted person, DNS profiles."],
  ["emergency", "Emergency pause", "Breathe, name the trigger, wait 20 min."],
  ["vault", "Solana Vault", "Devnet commitment signed on-chain."],
  ["rebuild", "Rebuild", "Debt plan with monthly installments."],
  ["coach", "AI Coach", "10 free messages a day."],
  ["games", "Games", "+20 credits for riding out an urge."],
  ["work", "Work", "Submit proof, get verified, earn."],
];

const ROADMAP: { phase: string; status: "done" | "next" | "later"; items: string[] }[] = [
  { phase: "Phase 1 · Foundation", status: "done", items: ["Design system, light & dark", "Emergency pause, missions, progress", "Games arcade"] },
  { phase: "Phase 2 · Protection & Web3", status: "done", items: ["AI Coach", "NextDNS iPhone/Android shields", "Debt snowball/avalanche + installments", "Solana Devnet Commitment Vault"] },
  { phase: "Phase 3 · Community", status: "done", items: ["Accounts & cross-device sync", "Live feed, cheers, comments", "Work submissions + reviewer"] },
  { phase: "Phase 4 · Colosseum sprint", status: "next", items: ["Anchor PDA escrow (time-lock + guardian co-sign)", "Soulbound cNFT milestone badges", "Solana Blinks for cheers & grants"] },
  { phase: "Phase 5 · Launch", status: "later", items: ["Native iOS (FamilyControls) & Android blockers", "USDC work payouts", "Weekly AI review, mainnet"] },
];

const CHECK: [string, boolean][] = [
  ["Working app deployed", true], ["Solana Devnet integration (wallet + memo tx)", true],
  ["Public GitHub repo", false], ["3-minute pitch video", false], ["Technical demo video", false], ["Anchor escrow program on Devnet", false],
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-24 space-y-4"><h2 className="font-display text-2xl font-semibold md:text-3xl">{title}</h2>{children}</section>;
}
const Box = ({ children, className = "" }: { children: React.ReactNode; className?: string }) =>
  <div className={`glass rounded-3xl p-5 ${className}`}>{children}</div>;

function Docs() {
  return (
    <div className="min-h-screen pb-40">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-2"><Link to="/app" className="glass rounded-full px-4 py-2 text-sm">Open app</Link><ThemeToggle /></div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-5 pb-3">
          {TOC.map(([id, l]) => <a key={id} href={`#${id}`} className="glass shrink-0 rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-foreground">{l}</a>)}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl space-y-14 px-5 pt-10">
        <Section id="pitch" title="">
          <div className="flex flex-wrap gap-2 text-xs">{["Colosseum", "Consumer", "Crypto × AI", "Public good", "Solana Devnet"].map((t) => <span key={t} className="glass rounded-full px-3 py-1">{t}</span>)}</div>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-6xl">One Chance: <span className="text-gradient">trustless recovery</span> from gambling.</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">Blockers alone get switched off in a weak moment. One Chance adds skin in the game: Solana commitment vaults, a trusted person, an AI coach and a community that cheers every day you stay safe.</p>
        </Section>

        <Section id="problem" title="The problem">
          <div className="grid gap-3 md:grid-cols-3">
            <Box><p className="font-semibold">Always one tap away</p><p className="mt-1 text-sm text-muted-foreground">Betting and casino apps live in every pocket, 24/7.</p></Box>
            <Box><p className="font-semibold">Blockers are easy to undo</p><p className="mt-1 text-sm text-muted-foreground">Most can be turned off in seconds during an urge.</p></Box>
            <Box><p className="font-semibold">Recovery is lonely</p><p className="mt-1 text-sm text-muted-foreground">Shame keeps people quiet; debt keeps them stuck.</p></Box>
          </div>
        </Section>

        <Section id="product" title="Product tour">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SHOTS.map(([f, t, d]) => (
              <figure key={f} className="glass overflow-hidden rounded-3xl">
                <img src={`/docs/${f}.jpg`} alt={`${t} screen`} loading="lazy" className="aspect-[393/800] w-full object-cover object-top" />
                <figcaption className="p-3"><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted-foreground">{d}</p></figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section id="solana" title="Solana architecture">
          <Box className="font-mono text-xs leading-relaxed md:text-sm">
            <pre className="overflow-x-auto whitespace-pre">{`Wallet (Phantom / Solflare / Backpack)
   │  sign
   ▼
Commitment tx ──► Memo program  "one-chance:commit:30d"
   │
   └─ optional stake ──► trusted person's wallet

Next (Anchor):
Vault PDA [user, start, days, guardian]
   ├─ unlock()  after milestone date  → back to user
   └─ release() guardian co-sign       → partner / charity`}</pre>
          </Box>
          <div className="grid gap-3 md:grid-cols-3">
            <Box><p className="font-semibold">Live now</p><p className="mt-1 text-sm text-muted-foreground">Devnet wallet connect, airdrop, signed commitments, explorer links.</p></Box>
            <Box><p className="font-semibold">Soulbound badges</p><p className="mt-1 text-sm text-muted-foreground">Compressed NFTs for Day 30/90/180 — proof without revealing identity.</p></Box>
            <Box><p className="font-semibold">Blinks</p><p className="mt-1 text-sm text-muted-foreground">Share a win on X; friends cheer or send a small grant.</p></Box>
          </div>
        </Section>

        <Section id="blocker" title="Betting & casino blocker">
          <div className="grid gap-3 md:grid-cols-3">
            <Box><p className="font-semibold">Today (web)</p><p className="mt-1 text-sm text-muted-foreground">iPhone DNS profile, Android Private DNS and a hosts blocklist stop betting sites on the whole phone.</p></Box>
            <Box><p className="font-semibold">iPhone app (coming)</p><p className="mt-1 text-sm text-muted-foreground">Apple Screen Time controls shield every gambling app and block new installs.</p></Box>
            <Box><p className="font-semibold">Android app (coming)</p><p className="mt-1 text-sm text-muted-foreground">Detects betting apps on open, shows a calm pause screen, filters betting traffic.</p></Box>
          </div>
          <Box><p className="text-sm"><span className="font-semibold">48-hour cooldown:</span> <span className="text-muted-foreground">turning protection off always waits 48 hours, and the trusted person is told.</span></p></Box>
        </Section>

        <Section id="roadmap" title="Roadmap">
          <ol className="relative space-y-4 border-l border-border pl-6">
            {ROADMAP.map((r) => (
              <li key={r.phase} className="relative">
                <span className={`absolute -left-[31px] top-5 size-3 rounded-full ${r.status === "done" ? "bg-primary" : r.status === "next" ? "bg-accent" : "bg-muted"}`} />
                <Box>
                  <div className="flex items-center justify-between"><p className="font-semibold">{r.phase}</p><span className="text-xs uppercase text-muted-foreground">{r.status === "done" ? "Shipped" : r.status === "next" ? "Next" : "Later"}</span></div>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">{r.items.map((i) => <li key={i}>• {i}</li>)}</ul>
                </Box>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="submission" title="Colosseum checklist">
          <Box><ul className="space-y-2">{CHECK.map(([t, ok]) => <li key={t} className="flex items-center gap-2 text-sm">{ok ? <Check className="size-4 text-primary" /> : <Circle className="size-4 text-muted-foreground" />}{t}</li>)}</ul></Box>
          <a href="https://arena.colosseum.org" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary">Colosseum Arena <ExternalLink className="size-3.5" /></a>
        </Section>
      </main>
      <AskAiBox />
    </div>
  );
}
