import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Chip, Button, PageHeader, Eyebrow, DemoNote } from "@/components/oc/ui";

export const Route = createFileRoute("/app/work")({
  head: () => ({ meta: [{ title: "Work — One Chance" }, { name: "description", content: "Legitimate work challenges matched to your skills." }, { property: "og:title", content: "Work — One Chance" }, { property: "og:description", content: "Legitimate work challenges matched to your skills." }] }),
  component: Work,
});

const JOBS = [
  { id: "1", title: "Write 5 product descriptions", biz: "Local bakery", skill: "Writing", pay: "Fixed fee", time: "3 hrs" },
  { id: "2", title: "Answer customer emails for a week", biz: "Online bike shop", skill: "Customer service", pay: "Hourly", time: "10 hrs" },
  { id: "3", title: "Organise a shared spreadsheet", biz: "Community garden", skill: "Admin", pay: "Fixed fee", time: "2 hrs" },
  { id: "4", title: "Design a simple flyer", biz: "Yoga studio", skill: "Design", pay: "Fixed fee", time: "2 hrs" },
];

function Work() {
  const [skill, setSkill] = useState("All");
  const [applied, setApplied] = useState<string[]>([]);
  const skills = ["All", ...new Set(JOBS.map((j) => j.skill))];
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Work" title="Work for you" sub="Businesses only see your skills and work. Never your recovery." />
      <DemoNote>These are sample challenges. The live marketplace with real businesses and payments is coming next.</DemoNote>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
        {skills.map((s) => <Chip key={s} active={skill === s} onClick={() => setSkill(s)}>{s}</Chip>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {JOBS.filter((j) => skill === "All" || j.skill === skill).map((j) => (
          <Card key={j.id} className="flex flex-col">
            <Eyebrow>{j.biz}</Eyebrow>
            <p className="mt-2 text-lg font-medium">{j.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{j.skill} · {j.time} · {j.pay}</p>
            <Button variant={applied.includes(j.id) ? "glass" : "solid"} size="sm" className="mt-5 self-start" disabled={applied.includes(j.id)}
              onClick={() => setApplied([...applied, j.id])}>{applied.includes(j.id) ? "Applied" : "Apply"}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
