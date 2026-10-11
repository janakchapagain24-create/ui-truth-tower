import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Check, X } from "lucide-react";
import { Card, Chip, Button, Progress, PageHeader, Eyebrow } from "@/components/oc/ui";
import { MISSIONS, type Mission } from "@/lib/missions";
import { useStore, completeMission, isDoneToday, levelOf, LEVELS } from "@/lib/store";

export const Route = createFileRoute("/app/missions")({
  head: () => ({ meta: [{ title: "Missions — One Chance" }, { name: "description", content: "Small daily missions that rebuild your life step by step." }, { property: "og:title", content: "Missions — One Chance" }, { property: "og:description", content: "Small daily missions that rebuild your life." }] }),
  component: MissionsPage,
});

function MissionsPage() {
  const s = useStore();
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<Mission | null>(null);
  const [justDone, setJustDone] = useState<Mission | null>(null);
  const cats = ["All", ...new Set(MISSIONS.map((m) => m.category))];
  const lvl = levelOf(s.credits);
  const list = MISSIONS.filter((m) => cat === "All" || m.category === cat);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Missions" title="One step at a time" sub="Missions are fixed and in order — no luck involved. Credits are internal points, not money." />

      <Card>
        <div className="mb-4 flex justify-between text-sm"><span>Level {lvl.idx + 1} · {lvl.name}</span><span className="text-muted-foreground">{s.credits} credits</span></div>
        <Progress value={lvl.progress} />
        <div className="mt-4 flex justify-between text-[11px] text-muted-foreground">
          {LEVELS.map((l, i) => <span key={l} className={i <= lvl.idx ? "text-foreground" : ""}>{l}</span>)}
        </div>
      </Card>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0">
        {cats.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((m) => {
          const done = isDoneToday(s, m.id);
          return (
            <button key={m.id} onClick={() => setOpen(m)} className="glass rounded-3xl p-5 text-left transition hover:bg-secondary">
              <Eyebrow>{m.category}</Eyebrow>
              <p className="mt-2 font-medium">{m.title}</p>
              <p className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="size-3" />{m.minutes} min</span>
                <span>+{m.reward} credits</span>
                {done && <span className="flex items-center gap-1 text-success"><Check className="size-3" />Done today</span>}
              </p>
            </button>
          );
        })}
      </div>

      {(open || justDone) && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-4 backdrop-blur-sm md:items-center" onClick={() => { setOpen(null); setJustDone(null); }}>
          <Card className="w-full max-w-md fade-up bg-card" onClick={(e) => e.stopPropagation()}>
            {justDone ? (
              <div className="py-6 text-center">
                <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-success text-accent-foreground"><Check /></span>
                <h2 className="text-2xl font-semibold">Mission complete</h2>
                <p className="mt-2 text-accent">+{justDone.reward} Mission Credits</p>
                <p className="mt-1 text-sm text-muted-foreground">Next step unlocked.</p>
                <Button variant="solid" className="mt-6" onClick={() => setJustDone(null)}>Continue</Button>
              </div>
            ) : open && (
              <>
                <div className="flex items-start justify-between"><Eyebrow>{open.category} · {open.minutes} min</Eyebrow>
                  <button aria-label="Close" onClick={() => setOpen(null)}><X className="size-4" /></button></div>
                <h2 className="mt-2 text-xl font-semibold">{open.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{open.why}</p>
                <ol className="mt-5 space-y-2 text-sm">
                  {open.steps.map((st, i) => <li key={st} className="flex gap-3 rounded-2xl bg-muted p-3"><span className="text-muted-foreground">{i + 1}</span>{st}</li>)}
                </ol>
                <Button variant="accent" className="mt-6 w-full" disabled={isDoneToday(s, open.id)}
                  onClick={() => { completeMission(open.id); setJustDone(open); setOpen(null); }}>
                  {isDoneToday(s, open.id) ? "Done today" : "Complete mission"}
                </Button>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
