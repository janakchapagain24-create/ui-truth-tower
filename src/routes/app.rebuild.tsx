import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { Card, Chip, PageHeader, Eyebrow } from "@/components/oc/ui";
import { useStore, setState } from "@/lib/store";

export const Route = createFileRoute("/app/rebuild")({
  head: () => ({ meta: [{ title: "Rebuild — One Chance" }, { name: "description", content: "Your skills, resources, goal and income path." }, { property: "og:title", content: "Rebuild — One Chance" }, { property: "og:description", content: "Your skills, resources, goal and income path." }] }),
  component: Rebuild,
});

const RESOURCES = ["Phone", "Laptop", "Internet", "Time", "Car", "Tools", "Quiet space"];
const PATH = ["Skill", "Service", "Portfolio", "Outreach", "First client", "Repeat clients", "Business"];

function Rebuild() {
  const s = useStore();
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
        <h2 className="mb-6 text-lg font-semibold">Income path</h2>
        <ol className="flex flex-col gap-3 md:flex-row md:items-center">
          {PATH.map((p, i) => (
            <li key={p} className="flex flex-1 items-center gap-3 md:flex-col md:text-center">
              <span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${i < 1 ? "bg-gradient-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{i + 1}</span>
              <span className="text-sm">{p}</span>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {[["30-day plan", ["Week 1: protection + routine", "Week 2: practice your top skill daily", "Week 3: write one clear service offer", "Week 4: reach out to 5 people"]],
          ["90-day plan", ["Month 1: steady footing", "Month 2: build a small portfolio", "Month 3: find a first paying client"]]].map(([t, items]) => (
          <Card key={t as string}>
            <h2 className="mb-4 text-lg font-semibold">{t as string}</h2>
            <ul className="space-y-2 text-sm">{(items as string[]).map((x) => <li key={x} className="rounded-2xl bg-muted p-3">{x}</li>)}</ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
