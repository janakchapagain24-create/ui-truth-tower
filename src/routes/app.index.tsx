import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Check, Clock } from "lucide-react";
import { Card, Eyebrow, Progress, pill, Chip } from "@/components/oc/ui";
import { MISSIONS } from "@/lib/missions";
import { useStore, protectionDay, completeMission, isDoneToday, setState, levelOf, type Mood } from "@/lib/store";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Home — One Chance" }, { name: "description", content: "Your protection, missions and next step." }, { property: "og:title", content: "Home — One Chance" }, { property: "og:description", content: "Your protection, missions and next step." }] }),
  component: HomePage,
});

const MOODS: Mood[] = ["Good", "Okay", "Stressed", "Strong urge", "Need someone to talk to"];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function HomePage() {
  const s = useStore();
  const lvl = levelOf(s.credits);
  const todays = MISSIONS.slice(0, 4);
  const mood = s.mood?.date === new Date().toISOString().slice(0, 10) ? s.mood.value : undefined;

  return (
    <div className="space-y-6">
      <h1 className="fade-up text-3xl font-semibold md:text-4xl">{greeting()}, {s.name}.</h1>

      <Card className="fade-up flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <span className="grid size-16 place-items-center rounded-full bg-gradient-accent shadow-glow">
            <ShieldCheck className="size-8 text-accent-foreground" />
          </span>
          <div>
            <Eyebrow className="text-success">Protected</Eyebrow>
            <p className="font-display text-4xl font-semibold">Day {protectionDay(s)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/app/protect" className={pill({ variant: "glass" })}>View protection</Link>
          <Link to="/app/emergency" className={pill({ variant: "danger" })}>Emergency mode</Link>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">How are you feeling today?</h2>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <Chip key={m} active={mood === m}
              onClick={() => setState((x) => ({ ...x, mood: { value: m, date: new Date().toISOString().slice(0, 10) } }))}>{m}</Chip>
          ))}
        </div>
        {(mood === "Strong urge" || mood === "Need someone to talk to") && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/app/emergency" className={pill({ variant: "danger", size: "sm" })}>Start emergency mode</Link>
            <Link to="/app/coach" className={pill({ variant: "glass", size: "sm" })}>Talk to the coach</Link>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's missions</h2>
            <Link to="/app/missions" className="text-sm text-muted-foreground hover:text-foreground">All missions</Link>
          </div>
          <ul className="space-y-2">
            {todays.map((m) => {
              const done = isDoneToday(s, m.id);
              return (
                <li key={m.id} className="flex items-center gap-4 rounded-2xl bg-muted p-4">
                  <div className="flex-1">
                    <p className={done ? "text-muted-foreground line-through" : "font-medium"}>{m.title}</p>
                    <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{m.category}</span><span className="flex items-center gap-1"><Clock className="size-3" />{m.minutes} min</span><span>+{m.reward} credits</span>
                    </p>
                  </div>
                  <button aria-label={`Complete ${m.title}`} onClick={() => completeMission(m.id)} disabled={done}
                    className={`grid size-10 place-items-center rounded-full transition ${done ? "bg-success text-accent-foreground" : "glass hover:bg-secondary"}`}>
                    <Check className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold">Rebuild progress</h2>
          <p className="mb-5 text-sm text-muted-foreground">Level {lvl.idx + 1} · {lvl.name} · {s.credits} credits</p>
          <Progress value={lvl.progress} />
          <div className="mt-6 rounded-2xl bg-muted p-4">
            <Eyebrow className="mb-1">Your next step</Eyebrow>
            <p className="text-sm">{s.skills[0] ? `Spend 20 minutes on ${s.skills[0].toLowerCase()} and save what you make.` : "Add one skill on the Rebuild page."}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
