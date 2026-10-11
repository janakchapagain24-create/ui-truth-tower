import { DebtOrganizer } from "@/components/oc/DebtOrganizer";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, Check } from "lucide-react";
import { Card, Chip, PageHeader, Eyebrow, Progress } from "@/components/oc/ui";
import { useStore, setState, useExtra, setExtra } from "@/lib/store";

export const Route = createFileRoute("/app/rebuild")({
  head: () => ({ meta: [{ title: "Rebuild — One Chance" }, { name: "description", content: "Your skills, resources, goal and income path." }, { property: "og:title", content: "Rebuild — One Chance" }, { property: "og:description", content: "Your skills, resources, goal and income path." }] }),
  component: Rebuild,
});

const RESOURCES = ["Phone", "Laptop", "Internet", "Time", "Car", "Tools", "Quiet space"];
const PATH = ["Skill", "Service", "Portfolio", "Outreach", "First client", "Repeat clients", "Business"];
const FOCUS = [
  "Pick one skill and practise it for 30 minutes a day this week.",
  "Write one sentence: who you help, and with what.",
  "Make 2–3 small samples that show what you can do.",
  "Message 5 people you know about your service.",
  "Do your first job well — on time, as promised.",
  "Ask happy clients for a review or another job.",
  "Set simple prices and keep track of what comes in and goes out.",
];
const PLANS: [string, string[]][] = [
  ["30-day plan", ["Week 1: protection + routine", "Week 2: practice your top skill daily", "Week 3: write one clear service offer", "Week 4: reach out to 5 people"]],
  ["90-day plan", ["Month 1: steady footing", "Month 2: build a small portfolio", "Month 3: find a first paying client"]],
];

function Rebuild() {
  const s = useStore();
  const x = useExtra();
  const stage = Math.min(x.pathStage ?? 0, PATH.length - 1);
  const doneSet = new Set(x.planDone ?? []);
  const [skill, setSkill] = useState("");
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Rebuild" title="Build forward" sub="A real plan, one piece at a time. We never promise a specific income result." />

      <Card>
        <Eyebrow className="mb-2">Your goal</Eyebrow>
        <input className="w-full bg-transparent font-display text-xl font-semibold outline-none md:text-2xl" value={s.goal}
          onChange={(e) => setState((x) => ({ ...x, goal: e.target.value }))} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Your skills</h2>
          <div className="flex flex-wrap gap-2">
            {s.skills.map((k) => (
              <span key={k} className="flex h-10 items-center gap-2 rounded-full bg-secondary pl-4 pr-2 text-sm">{k}
                <button aria-label={`Remove ${k}`} onClick={() => setState((x) => ({ ...x, skills: x.skills.filter((y) => y !== k) }))}><X className="size-3.5" /></button></span>
            ))}
          </div>
          <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!skill.trim()) return; setState((x) => ({ ...x, skills: [...x.skills, skill.trim()] })); setSkill(""); }}>
            <input className="flex-1 rounded-full bg-muted px-4 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Add a skill" value={skill} onChange={(e) => setSkill(e.target.value)} />
            <Chip type="submit" active>Add</Chip>
          </form>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Your resources</h2>
          <div className="flex flex-wrap gap-2">
            {RESOURCES.map((r) => (
              <Chip key={r} active={s.resources.includes(r)} onClick={() => setState((x) => ({ ...x, resources: x.resources.includes(r) ? x.resources.filter((y) => y !== r) : [...x.resources, r] }))}>{r}</Chip>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold">Income path</h2>
          <span className="text-sm text-muted-foreground">Tap where you are now</span>
        </div>
        <ol className="flex flex-col gap-3 md:flex-row md:items-center">
          {PATH.map((p, i) => {
            const done = i < stage, now = i === stage;
            return (
              <li key={p} className="flex-1">
                <button onClick={() => setExtra((e) => ({ ...e, pathStage: i }))} aria-current={now ? "step" : undefined}
                  className="flex w-full items-center gap-3 rounded-2xl p-1 text-left transition hover:bg-secondary md:flex-col md:text-center">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${done || now ? "bg-gradient-accent text-accent-foreground" : "bg-secondary text-muted-foreground"} ${now ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}>
                    {done ? <Check className="size-4" /> : i + 1}
                  </span>
                  <span className={`text-sm ${now ? "font-semibold" : ""}`}>{p}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div key={stage} className="glass mt-6 rounded-3xl p-5 fade-up">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Your focus now · Step {stage + 1} of {PATH.length}</p>
          <p className="mt-1 text-lg font-semibold">{PATH[stage]}</p>
          <p className="mt-1 text-sm text-muted-foreground">{FOCUS[stage]}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {stage < PATH.length - 1 ? (
              <Chip active onClick={() => setExtra((e) => ({ ...e, pathStage: stage + 1 }))}><Check className="size-4" /> Done — next: {PATH[stage + 1]}</Chip>
            ) : <span className="text-sm font-medium">You've reached the last step. Keep it steady.</span>}
            {stage > 0 && <Chip onClick={() => setExtra((e) => ({ ...e, pathStage: stage - 1 }))}>Back</Chip>}
          </div>
        </div>
      </Card>

      <DebtOrganizer />

      <div className="grid gap-6 lg:grid-cols-2">
        {PLANS.map(([t, items]) => {
          const n = items.filter((i) => doneSet.has(i)).length;
          return (
            <Card key={t}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">{t}</h2>
                <span className="text-sm text-muted-foreground">{n}/{items.length} done</span>
              </div>
              <Progress value={(n / items.length) * 100} />
              <ul className="mt-4 space-y-2 text-sm">
                {items.map((it) => {
                  const on = doneSet.has(it);
                  return (
                    <li key={it}>
                      <button onClick={() => setExtra((e) => ({ ...e, planDone: on ? (e.planDone ?? []).filter((y) => y !== it) : [...(e.planDone ?? []), it] }))}
                        className="flex w-full items-center gap-3 rounded-2xl bg-muted p-3 text-left transition hover:bg-secondary">
                        <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{on && <Check className="size-3" />}</span>
                        <span className={on ? "text-muted-foreground line-through" : ""}>{it}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
