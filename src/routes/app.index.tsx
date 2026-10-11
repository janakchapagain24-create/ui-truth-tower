import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ShieldCheck, Heart, MessageCircle, Send, Bookmark, Plus, X, Gamepad2, Check, Siren } from "lucide-react";
import { Card, Chip, Button, DemoNote } from "@/components/oc/ui";
import { MISSIONS } from "@/lib/missions";
import { useAuth } from "@/hooks/useAuth";
import { useFeed } from "@/lib/feed";
import { useStore, protectionDay, completeMission, isDoneToday, setState, levelOf, type Mood } from "@/lib/store";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [
    { title: "Home — One Chance" },
    { name: "description", content: "Your feed of wins, stories and daily missions." },
    { property: "og:title", content: "Home — One Chance" },
    { property: "og:description", content: "Your feed of wins, stories and daily missions." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: HomePage,
});

const MOODS: Mood[] = ["Good", "Okay", "Stressed", "Strong urge", "Need someone to talk to"];

const STORIES = [
  { who: "Sam", note: "Day 40 protected. Forty. I didn't think I'd get past four." },
  { who: "Ana", note: "Morning walk done. Sky was pink today." },
  { who: "Jordan", note: "Sent my first client proposal!" },
  { who: "Priya", note: "Paid off my first small debt. One down." },
  { who: "Leo", note: "Learning spreadsheets. Day 3." },
  { who: "Mia", note: "Urge hit at 11pm. Played Tetris instead. Still here." },
];

type Post = { id: number | string; mine?: boolean; who: string; time: string; tag: string; text: string; badge?: string; cheers: number; comments: string[] };
const SEED: Post[] = [
  { id: 1, who: "Sam", time: "2h", tag: "#Day40", badge: "40 days protected", text: "Finished my first logo for a real client today. Small, but real.", cheers: 124, comments: ["Ana: So proud of you!", "Leo: Keep going 🔥"] },
  { id: 2, who: "Ana", time: "5h", tag: "#MorningWalk", text: "Week three of walking every morning. My head is clearer and the urges are quieter.", cheers: 86, comments: ["Mia: Needed this today."] },
  { id: 3, who: "Jordan", time: "1d", tag: "#FirstClient", badge: "First client", text: "Wrote my service offer. Scary to hit send. Did it anyway.", cheers: 152, comments: [] },
  { id: 4, who: "Priya", time: "2d", tag: "#DebtFree", text: "Cleared one card. Writing down every payment made it feel real.", cheers: 98, comments: ["Sam: That's huge."] },
];

const HUES = ["oklch(0.7 0.12 20)", "oklch(0.7 0.12 160)", "oklch(0.7 0.12 250)", "oklch(0.7 0.12 80)", "oklch(0.7 0.12 320)", "oklch(0.7 0.12 200)"];
const hue = (n: string) => HUES[n.charCodeAt(0) % HUES.length];

function Avatar({ name, size = "size-10" }: { name: string; size?: string }) {
  return <span className={`grid ${size} shrink-0 place-items-center rounded-full font-semibold text-accent-foreground`} style={{ background: hue(name) }}>{name[0]}</span>;
}

function HomePage() {
  const s = useStore();
  const lvl = levelOf(s.credits);
  const [posts, setPosts] = useState(SEED);
  const [liked, setLiked] = useState<(number | string)[]>([]);
  const { user } = useAuth();
  const feed = useFeed(user?.id ?? null);
  const [story, setStory] = useState<number | null>(null);
  const [compose, setCompose] = useState(false);
  const mood = s.mood?.date === new Date().toISOString().slice(0, 10) ? s.mood.value : undefined;
  const todays = MISSIONS.slice(0, 4);

  const like = (id: number | string, only = false) =>
    setLiked((l) => (l.includes(id) ? (only ? l : l.filter((x) => x !== id)) : [...l, id]));

  return (
    <div className="mx-auto max-w-xl space-y-5">
      {/* Stories */}
      <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0">
        <button onClick={() => setCompose(true)} className="flex shrink-0 flex-col items-center gap-1.5">
          <span className="relative">
            <Avatar name={s.name || "You"} size="size-16" />
            <span className="absolute -bottom-0.5 -right-0.5 grid size-6 place-items-center rounded-full border-2 border-background bg-accent text-accent-foreground"><Plus className="size-3.5" /></span>
          </span>
          <span className="text-xs">Your win</span>
        </button>
        {STORIES.map((st, i) => (
          <button key={st.who} onClick={() => setStory(i)} className="flex shrink-0 flex-col items-center gap-1.5">
            <span className="rounded-full bg-gradient-story p-[2.5px]"><span className="block rounded-full bg-background p-[2px]"><Avatar name={st.who} size="size-[58px]" /></span></span>
            <span className="text-xs">{st.who}</span>
          </button>
        ))}
      </div>

      {/* Status */}
      <Card className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-4">
        <span className="grid size-12 place-items-center rounded-full bg-gradient-accent shadow-glow"><ShieldCheck className="size-6 text-accent-foreground" /></span>
        <div className="min-w-0">
          <p className="truncate font-display text-xl font-semibold">Day {protectionDay(s)} protected</p>
          <p className="truncate text-xs text-muted-foreground">Level {lvl.idx + 1} · {lvl.name} · {s.credits} credits</p>
        </div>
        <Link to="/app/games" aria-label="Games" className="glass grid size-10 place-items-center rounded-full"><Gamepad2 className="size-4" /></Link>
      </Card>

      {/* Mood */}
      <Card className="p-4">
        <p className="mb-3 text-sm font-medium">How are you feeling?</p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {MOODS.map((m) => (
            <Chip key={m} active={mood === m} className="shrink-0"
              onClick={() => setState((x) => ({ ...x, mood: { value: m, date: new Date().toISOString().slice(0, 10) } }))}>{m}</Chip>
          ))}
        </div>
        {(mood === "Strong urge" || mood === "Need someone to talk to") && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/app/emergency" className="flex items-center gap-1.5 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground"><Siren className="size-4" />Emergency mode</Link>
            <Link to="/app/games" className="glass rounded-full px-4 py-2 text-sm">Play a game</Link>
          </div>
        )}
      </Card>

      {/* Missions carousel */}
      <div>
        <div className="mb-2 flex items-center justify-between"><p className="text-sm font-semibold">Today's missions</p><Link to="/app/missions" className="text-xs text-muted-foreground">See all</Link></div>
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 md:mx-0 md:px-0">
          {todays.map((m) => {
            const done = isDoneToday(s, m.id);
            return (
              <Card key={m.id} className="w-48 shrink-0 p-4">
                <p className={`line-clamp-2 text-sm ${done ? "text-muted-foreground line-through" : "font-medium"}`}>{m.title}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">+{m.reward} · {m.minutes}m</span>
                  <button aria-label={`Complete ${m.title}`} disabled={done} onClick={() => completeMission(m.id)}
                    className={`grid size-8 place-items-center rounded-full ${done ? "bg-success text-accent-foreground" : "bg-secondary"}`}><Check className="size-4" /></button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {user ? (
        <>
          {feed.posts.length === 0 && <Card className="p-5 text-center text-sm text-muted-foreground">No wins shared yet. Be the first — tap + below.</Card>}
          {feed.posts.map((p) => (
            <PostCard key={p.id} p={{ ...p, cheers: p.cheers - (p.cheered ? 1 : 0) }} liked={p.cheered}
              onLike={(only) => { if (only && p.cheered) return; void feed.cheer(p.id, !p.cheered); }}
              onComment={(t) => void feed.comment(p.id, t)} onDelete={p.mine ? () => void feed.remove(p.id) : undefined} />
          ))}
        </>
      ) : (
        <>
          <DemoNote>Sample posts. <Link to="/auth" className="underline">Sign in</Link> to share wins, cheer and comment with real members.</DemoNote>
          {posts.map((p) => <PostCard key={p.id} p={p} liked={liked.includes(p.id)} onLike={(only) => like(p.id, only)} />)}
        </>
      )}

      {/* FAB */}
      <button onClick={() => setCompose(true)} aria-label="Share a win"
        className="fixed bottom-40 right-5 z-40 grid size-14 place-items-center rounded-full bg-gradient-accent text-accent-foreground shadow-glow md:bottom-10 md:right-10">
        <Plus className="size-6" />
      </button>

      {story !== null && <StoryViewer i={story} onClose={() => setStory(null)} onNext={() => setStory(story + 1 < STORIES.length ? story + 1 : null)} />}
      {compose && <Composer onClose={() => setCompose(false)} onPost={(text) => { if (user) { void feed.post(text); setCompose(false); return; } setPosts([{ id: Date.now(), who: "You", time: "now", tag: "#MyWin", text, cheers: 0, comments: [] }, ...posts]); setCompose(false); }} />}
    </div>
  );
}

function PostCard({ p, liked, onLike, onComment, onDelete }: { p: Post; liked: boolean; onLike: (only: boolean) => void; onComment?: (t: string) => void; onDelete?: (() => void) | undefined }) {
  const [burst, setBurst] = useState(0);
  const [draft, setDraft] = useState("");
  const [showComments, setShowComments] = useState(false);
  const last = useRef(0);
  const tap = () => {
    const now = Date.now();
    if (now - last.current < 300) { onLike(true); setBurst((b) => b + 1); }
    last.current = now;
  };
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center gap-3 p-4">
        <Avatar name={p.who} />
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{p.who}</p><p className="text-xs text-muted-foreground">{p.time}</p></div>
        {onDelete && <button aria-label="Delete post" onClick={onDelete} className="text-muted-foreground"><X className="size-4" /></button>}
      </div>
      <div onClick={tap} className="relative grid aspect-square cursor-pointer select-none place-items-center p-8 text-center"
        style={{ background: `linear-gradient(135deg, ${hue(p.who)}, color-mix(in oklab, ${hue(p.who)} 40%, var(--background)))` }}>
        <div>
          {p.badge && <span className="mb-4 inline-block rounded-full bg-background/80 px-3 py-1 text-xs font-semibold">{p.badge}</span>}
          <p className="font-display text-2xl font-semibold leading-snug text-accent-foreground">{p.text}</p>
        </div>
        {burst > 0 && <Heart key={burst} className="pop-heart pointer-events-none absolute size-24 fill-destructive text-destructive" />}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-4">
          <button aria-label="Cheer" onClick={() => onLike(false)}><Heart className={`size-6 transition ${liked ? "fill-destructive text-destructive" : ""}`} /></button>
          <button aria-label="Comments" onClick={() => setShowComments(!showComments)}><MessageCircle className="size-6" /></button>
          <Send className="size-6" />
          <Bookmark className="ml-auto size-6" />
        </div>
        <p className="mt-3 text-sm font-semibold">{p.cheers + (liked ? 1 : 0)} cheers</p>
        <p className="mt-1 text-sm"><span className="font-semibold">{p.who}</span> <span className="text-accent">{p.tag}</span></p>
        {p.comments.length > 0 && (
          <button onClick={() => setShowComments(!showComments)} className="mt-1 text-sm text-muted-foreground">
            {showComments ? "Hide comments" : `View all ${p.comments.length} comments`}
          </button>
        )}
        {showComments && <ul className="mt-2 space-y-1 text-sm">{p.comments.map((c, i) => <li key={i}>{c}</li>)}</ul>}
        {onComment && (showComments || p.comments.length === 0) && (
          <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { onComment(draft.trim().slice(0, 500)); setDraft(""); setShowComments(true); } }}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a kind word…" className="flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none" />
            <Button type="submit" size="sm" variant="solid" disabled={!draft.trim()}>Post</Button>
          </form>
        )}
      </div>
    </Card>
  );
}

function StoryViewer({ i, onClose, onNext }: { i: number; onClose: () => void; onNext: () => void }) {
  const st = STORIES[i];
  if (!st) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col p-5" style={{ background: `linear-gradient(160deg, ${hue(st.who)}, var(--background))` }} onClick={onNext}>
      <div className="flex gap-1">{STORIES.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full ${k <= i ? "bg-foreground" : "bg-foreground/30"}`} />)}</div>
      <div className="mt-4 flex items-center gap-3">
        <Avatar name={st.who} /><p className="flex-1 font-semibold">{st.who}</p>
        <button aria-label="Close story" onClick={(e) => { e.stopPropagation(); onClose(); }}><X className="size-6" /></button>
      </div>
      <p className="m-auto max-w-md text-center font-display text-3xl font-semibold">{st.note}</p>
      <p className="text-center text-xs text-muted-foreground">Tap for next</p>
    </div>
  );
}

function Composer({ onClose, onPost }: { onClose: () => void; onPost: (t: string) => void }) {
  const [t, setT] = useState("");
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-background/70 backdrop-blur md:place-items-center" onClick={onClose}>
      <Card className="w-full max-w-xl space-y-3 rounded-b-none md:rounded-b-[inherit]" onClick={(e) => e.stopPropagation()}>
        <p className="font-semibold">Share a win</p>
        <textarea autoFocus rows={4} value={t} onChange={(e) => setT(e.target.value)} placeholder="Something you built, finished or resisted today…"
          className="w-full resize-none rounded-2xl bg-muted p-3 text-sm outline-none" />
        <div className="flex justify-end gap-2">
          <Button variant="glass" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="solid" size="sm" disabled={!t.trim()} onClick={() => onPost(t.trim())}>Share</Button>
        </div>
      </Card>
    </div>
  );
}
