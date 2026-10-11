import { useEffect, useState } from "react";
import { Apple, Smartphone, Clock, Rocket } from "lucide-react";
import { toast } from "sonner";
import { Card, Button, Chip, Eyebrow } from "./ui";
import { supabase } from "@/integrations/supabase/client";

const KEY = "oc-beta-waitlist";

const sections = [
  {
    icon: Apple, title: "iPhone & iPad",
    points: [
      "Uses Apple's Screen Time controls to cover every app in the Gambling category: casino, sports betting, poker and lottery apps.",
      "Covered apps show a calm “Paused by One Chance” screen instead of opening.",
      "Blocks new gambling app downloads unless your trusted person approves.",
      "A private web filter covers betting sites in every browser, even in apps that open web pages.",
    ],
  },
  {
    icon: Smartphone, title: "Android",
    points: [
      "Spots betting apps when they open and shows a breathing pause, then sends you back to your home screen.",
      "A filter on your phone blocks known gambling sites and app servers.",
      "One Chance can't be force-stopped or reset during an urge without your trusted person.",
    ],
  },
  {
    icon: Clock, title: "48-hour cooldown",
    points: [
      "Turning protection off, or deleting the app, starts a 48-hour wait.",
      "Your trusted person gets a message and can confirm or cancel.",
      "Urges usually pass long before the wait ends.",
    ],
  },
];

export function LaunchGuide() {
  const [joined, setJoined] = useState<null | { email: string; platform: string }>(null);
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState("iPhone");
  useEffect(() => { try { const v = localStorage.getItem(KEY); if (v) setJoined(JSON.parse(v)); } catch {} }, []);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    const v = { email: email.trim().toLowerCase(), platform };
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("early_access").insert({ ...v, user_id: u.user?.id ?? null });
    if (error && error.code !== "23505") { toast.error("Couldn't join right now. Try again."); return; }
    localStorage.setItem(KEY, JSON.stringify(v));
    setJoined(v);
  }

  return (
    <Card className="space-y-5">
      <div>
        <Eyebrow><Rocket className="mr-1 inline size-3" />Coming soon</Eyebrow>
        <h2 className="mt-1 text-lg font-semibold">Phone app: block every betting & casino app</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A website can only block websites. The One Chance phone app (in development) will block betting apps on the phone itself. Here's how it will work.
        </p>
      </div>
      {sections.map(({ icon: Icon, title, points }) => (
        <div key={title} className="rounded-2xl bg-muted p-4">
          <p className="flex items-center gap-2 font-semibold"><Icon className="size-4" />{title}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {points.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">No blocker is perfect. One Chance makes gambling much harder to reach, alongside the people and tools that help you.</p>
      {joined ? (
        <p className="rounded-2xl bg-muted p-4 text-sm">You're on the early-access list for <b>{joined.platform}</b> ({joined.email}). We'll email you when it's ready to download.</p>
      ) : (
        <form onSubmit={join} className="space-y-3">
          <p className="text-sm font-medium">Join early access</p>
          <div className="flex gap-2">{["iPhone", "Android"].map((p) => <Chip key={p} active={platform === p} onClick={() => setPlatform(p)}>{p}</Chip>)}</div>
          <div className="flex gap-2">
            <input type="email" required className="flex-1 rounded-2xl bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" variant="solid">Join</Button>
          </div>
        </form>
      )}
    </Card>
  );
}
