import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, DemoNote, Chip } from "@/components/oc/ui";

export const Route = createFileRoute("/app/coach")({
  head: () => ({ meta: [{ title: "AI Coach — One Chance" }, { name: "description", content: "Private. Practical. On your side." }, { property: "og:title", content: "AI Coach — One Chance" }, { property: "og:description", content: "Private. Practical. On your side." }] }),
  component: Coach,
});

function Coach() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="One Chance AI" title="Private. Practical. On your side." />
      <DemoNote>The live coach switches on in the next step, once accounts are added. 10 free messages a day.</DemoNote>
      <Card className="space-y-4">
        <div className="max-w-[80%] text-sm">Hi. I'm here whenever you need to think something through — an urge, money, a next step. What's on your mind?</div>
        <div className="flex flex-wrap gap-2">
          {["I have an urge right now", "Help me plan my money", "What skill could earn?"].map((s) => <Chip key={s} disabled>{s}</Chip>)}
        </div>
      </Card>
    </div>
  );
}
