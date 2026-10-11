import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Chip, Button, PageHeader, Progress } from "@/components/oc/ui";
import { useStore, setState, protectionDay, levelOf } from "@/lib/store";

export const Route = createFileRoute("/app/progress")({
  head: () => ({ meta: [{ title: "Progress — One Chance" }, { name: "description", content: "Your progress is yours. Setbacks never erase it." }, { property: "og:title", content: "Progress — One Chance" }, { property: "og:description", content: "Your progress is yours." }] }),
  component: ProgressPage,
});

const KINDS = ["Urge", "Accidental exposure", "Gambling attempt", "Actual gambling", "Other"];

function ProgressPage() {
  const s = useStore();
  const lvl = levelOf(s.credits);
  const [setback, setSetback] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const stats = [
    ["Days protected", protectionDay(s)],
    ["Mission credits", s.credits],
    ["Missions completed", Object.keys(s.completed).length],
    ["Urges worked through", s.urgesResisted],
  ];
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Progress" title="Everything you've built" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([k, v]) => <Card key={k as string}><p className="font-display text-3xl font-semibold">{v}</p><p className="mt-1 text-sm text-muted-foreground">{k}</p></Card>)}
      </div>
      <Card><p className="mb-3 text-sm">Level {lvl.idx + 1} · {lvl.name}</p><Progress value={lvl.progress} /></Card>

      <Card>
        <h2 className="text-lg font-semibold">Had a setback?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your progress is still yours. Nothing here is shared or erased.</p>
        {saved ? (
          <p className="mt-4 rounded-2xl bg-muted p-4 text-sm">Thank you for being honest. Consider adding a trusted person or another blocked category on the Protect page today.</p>
        ) : (
          <>
            <p className="mt-5 mb-3 text-sm">What happened?</p>
            <div className="flex flex-wrap gap-2">{KINDS.map((k) => <Chip key={k} active={setback === k} onClick={() => setSetback(k)}>{k}</Chip>)}</div>
            <Button variant="solid" size="sm" className="mt-4" disabled={!setback}
              onClick={() => { setState((x) => ({ ...x, setbacks: [...x.setbacks, { date: new Date().toISOString(), kind: setback! }] })); setSaved(true); }}>Save privately</Button>
          </>
        )}
      </Card>
    </div>
  );
}
