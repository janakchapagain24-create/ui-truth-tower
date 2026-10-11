import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { Card, Button, PageHeader, DemoNote } from "@/components/oc/ui";

export const Route = createFileRoute("/app/community")({
  head: () => ({ meta: [{ title: "Community — One Chance" }, { name: "description", content: "Supportive people building forward together." }, { property: "og:title", content: "Community — One Chance" }, { property: "og:description", content: "Supportive people building forward together." }] }),
  component: Community,
});

type Post = { id: number; who: string; text: string; cheers: number; mine?: boolean };
const SEED: Post[] = [
  { id: 1, who: "Sam", text: "Finished my first logo for a real client today. Small, but real.", cheers: 12 },
  { id: 2, who: "Ana", text: "Week three of walking every morning. My head is clearer.", cheers: 8 },
  { id: 3, who: "Jordan", text: "Wrote my service offer. Scary to hit send. Did it anyway.", cheers: 15 },
];

function Community() {
  const [posts, setPosts] = useState(SEED);
  const [text, setText] = useState("");
  const [cheered, setCheered] = useState<number[]>([]);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Community" title="Building forward, together" sub="Share wins, not struggles you don't want to share. Your recovery stays private unless you choose otherwise." />
      <DemoNote>Sample posts. Real profiles, follows and messaging arrive with accounts.</DemoNote>
      <Card>
        <textarea className="w-full resize-none bg-transparent text-sm outline-none" rows={3} placeholder="Share something you built today…" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="flex justify-end"><Button variant="solid" size="sm" disabled={!text.trim()}
          onClick={() => { setPosts([{ id: Date.now(), who: "You", text, cheers: 0, mine: true }, ...posts]); setText(""); }}>Post</Button></div>
      </Card>
      {posts.map((p) => (
        <Card key={p.id}>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-secondary font-semibold">{p.who[0]}</span>
            <p className="font-medium">{p.who}</p>
          </div>
          <p className="mt-4">{p.text}</p>
          <button className="mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            onClick={() => !cheered.includes(p.id) && setCheered([...cheered, p.id])}>
            <Heart className={`size-4 ${cheered.includes(p.id) ? "fill-accent text-accent" : ""}`} /> {p.cheers + (cheered.includes(p.id) ? 1 : 0)} encouragements
          </button>
        </Card>
      ))}
    </div>
  );
}
