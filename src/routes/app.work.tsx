import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, Chip, Button, PageHeader, Eyebrow, DemoNote } from "@/components/oc/ui";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { setState } from "@/lib/store";
import { JOBS, WORK_REWARD } from "@/lib/work";

export const Route = createFileRoute("/app/work")({
  head: () => ({ meta: [
    { title: "Work — One Chance" },
    { name: "description", content: "Do real work challenges, submit proof and earn verified rewards." },
    { property: "og:title", content: "Work — One Chance" },
    { property: "og:description", content: "Do real work challenges, submit proof and earn verified rewards." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Work,
});

type Sub = { id: string; challenge_id: string; challenge_title: string; summary: string; proof_url: string | null; status: string; reward: number; reviewer_note: string | null; claimed: boolean; user_id: string };
const inp = "w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function Work() {
  const { user } = useAuth();
  const [skill, setSkill] = useState("All");
  const [subs, setSubs] = useState<Sub[]>([]);
  const [admin, setAdmin] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const skills = ["All", ...new Set(JOBS.map((j) => j.skill))];

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from("work_submissions").select("*").order("created_at", { ascending: false });
    setSubs((data ?? []) as Sub[]);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    void load();
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setAdmin(!!data));
  }, [user, load]);

  const mine = subs.filter((s) => s.user_id === user?.id);

  async function claim(s: Sub) {
    const { error } = await supabase.from("work_submissions").update({ claimed: true }).eq("id", s.id);
    if (error) return toast.error("Couldn't claim that reward.");
    setState((x) => ({ ...x, credits: x.credits + s.reward }));
    toast.success(`+${s.reward} credits. Real work, real progress.`);
    void load();
  }

  async function review(s: Sub, status: "verified" | "rejected", note: string) {
    const { error } = await supabase.from("work_submissions").update({ status, reward: status === "verified" ? WORK_REWARD : 0, reviewer_note: note || null }).eq("id", s.id);
    if (error) toast.error(error.message); else void load();
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Work" title="Work for you" sub="Do the challenge, send proof, get verified. Reviewers only see your work — never your recovery." />
      {!user && <DemoNote><Link to="/auth" className="underline">Sign in</Link> to submit work and earn verified rewards.</DemoNote>}
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
        {skills.map((s) => <Chip key={s} active={skill === s} onClick={() => setSkill(s)}>{s}</Chip>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {JOBS.filter((j) => skill === "All" || j.skill === skill).map((j) => {
          const sub = mine.find((s) => s.challenge_id === j.id && s.status !== "rejected");
          return (
            <Card key={j.id} className="flex flex-col">
              <Eyebrow>{j.biz}</Eyebrow>
              <p className="mt-2 text-lg font-medium">{j.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{j.skill} · {j.time} · +{WORK_REWARD} credits when verified</p>
              {open === j.id ? (
                <SubmitForm job={j} onDone={() => { setOpen(null); void load(); }} onCancel={() => setOpen(null)} />
              ) : sub ? (
                <p className="mt-5 text-sm font-medium">{sub.status === "verified" ? "Verified ✓" : "Under review"}</p>
              ) : (
                <Button variant="solid" size="sm" className="mt-5 self-start" disabled={!user} onClick={() => setOpen(j.id)}>Start & submit proof</Button>
              )}
            </Card>
          );
        })}
      </div>

      {mine.length > 0 && (
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">My submissions</h2>
          {mine.map((s) => (
            <div key={s.id} className="rounded-2xl bg-muted p-4 text-sm">
              <div className="flex items-center justify-between gap-2"><span className="font-medium">{s.challenge_title}</span>
                <span className="text-xs capitalize text-muted-foreground">{s.status === "submitted" ? "under review" : s.status}</span></div>
              {s.reviewer_note && <p className="mt-1 text-muted-foreground">Reviewer: {s.reviewer_note}</p>}
              {s.status === "verified" && !s.claimed && <Button size="sm" variant="solid" className="mt-3" onClick={() => claim(s)}>Claim +{s.reward} credits</Button>}
              {s.claimed && <p className="mt-1 text-xs text-muted-foreground">Reward claimed</p>}
            </div>
          ))}
        </Card>
      )}

      {admin && <ReviewQueue subs={subs.filter((s) => s.status === "submitted")} onReview={review} />}
    </div>
  );
}

function SubmitForm({ job, onDone, onCancel }: { job: (typeof JOBS)[number]; onDone: () => void; onCancel: () => void }) {
  const [summary, setSummary] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (url && !/^https?:\/\//.test(url)) return toast.error("Proof link must start with https://");
    setBusy(true);
    const { error } = await supabase.from("work_submissions").insert({ challenge_id: job.id, challenge_title: job.title, summary: summary.trim(), proof_url: url || null });
    setBusy(false);
    if (error) return toast.error("Couldn't send. Write at least a couple of sentences.");
    toast.success("Sent for review. Nice work.");
    onDone();
  }
  return (
    <form onSubmit={send} className="mt-4 space-y-2">
      <p className="text-xs text-muted-foreground">{job.brief}</p>
      <textarea required minLength={10} maxLength={2000} rows={4} className={inp + " resize-none"} placeholder="What did you do? Paste the work or describe it." value={summary} onChange={(e) => setSummary(e.target.value)} />
      <input className={inp} placeholder="Link to proof (Google Doc, Drive, Figma…) — optional" value={url} onChange={(e) => setUrl(e.target.value)} />
      <div className="flex gap-2"><Button type="submit" size="sm" variant="solid" disabled={busy}>Submit</Button><Button size="sm" variant="glass" onClick={onCancel}>Cancel</Button></div>
    </form>
  );
}

function ReviewQueue({ subs, onReview }: { subs: Sub[]; onReview: (s: Sub, st: "verified" | "rejected", note: string) => void }) {
  const [notes, setNotes] = useState<Record<string, string>>({});
  return (
    <Card className="space-y-3">
      <h2 className="text-lg font-semibold">Review queue ({subs.length})</h2>
      {subs.length === 0 && <p className="text-sm text-muted-foreground">Nothing waiting.</p>}
      {subs.map((s) => (
        <div key={s.id} className="space-y-2 rounded-2xl bg-muted p-4 text-sm">
          <p className="font-medium">{s.challenge_title}</p>
          <p className="whitespace-pre-wrap">{s.summary}</p>
          {s.proof_url && <a href={s.proof_url} target="_blank" rel="noreferrer noopener" className="text-accent underline">Open proof</a>}
          <input className={inp} placeholder="Note to member (optional)" value={notes[s.id] ?? ""} onChange={(e) => setNotes({ ...notes, [s.id]: e.target.value })} />
          <div className="flex gap-2">
            <Button size="sm" variant="solid" onClick={() => onReview(s, "verified", notes[s.id] ?? "")}>Verify</Button>
            <Button size="sm" variant="glass" onClick={() => onReview(s, "rejected", notes[s.id] ?? "")}>Needs changes</Button>
          </div>
        </div>
      ))}
    </Card>
  );
}
