import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Square, LifeBuoy } from "lucide-react";
import { Card, PageHeader, Chip } from "@/components/oc/ui";
import { CareDrawerButton } from "@/components/oc/CareResources";
import { useExtra, coachRemaining, useCoachMessage } from "@/lib/store";

export const Route = createFileRoute("/app/coach")({
  head: () => ({ meta: [{ title: "AI Coach — One Chance" }, { name: "description", content: "Private. Practical. On your side." }, { property: "og:title", content: "AI Coach — One Chance" }, { property: "og:description", content: "Private. Practical. On your side." }] }),
  component: Coach,
});

type Msg = { role: "user" | "assistant"; content: string };
const STARTERS = ["I have an urge right now", "Help me plan my money", "What skill could earn?", "I slipped yesterday"];

function Coach() {
  const x = useExtra();
  const left = coachRemaining(x);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: "Hi. I'm here whenever you need to think something through — an urge, money, a next step. What's on your mind?" }]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const abort = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs]);

  async function send(content: string) {
    if (!content.trim() || busy || left <= 0) return;
    setErr(""); setText("");
    const next = [...msgs, { role: "user" as const, content }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setBusy(true); useCoachMessage();
    const ctrl = new AbortController(); abort.current = ctrl;
    try {
      const res = await fetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.slice(1) }), signal: ctrl.signal });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(res.status === 429 ? "The coach is busy. Try again in a minute." : res.status === 402 ? "The coach is out of AI credits right now." : j.error || "Something went wrong.");
      }
      const reader = res.body.getReader(); const dec = new TextDecoder(); let acc = "";
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...next, { role: "assistant", content: acc }]);
      }
      if (!acc.trim()) throw new Error("No reply came back. Please try again.");
    } catch (e) {
      if ((e as Error).name !== "AbortError") { setErr((e as Error).message); setMsgs(next); }
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="One Chance AI" title="Private. Practical. On your side." />
      <CareDrawerButton />
      <div className="flex items-start gap-2 rounded-2xl bg-muted px-4 py-3 text-xs text-muted-foreground">
        <LifeBuoy className="mt-0.5 size-3.5 shrink-0" /> <span>One Chance AI is a supportive companion — not a therapist, doctor or crisis service. In danger? Call local emergency services. · {left} of 10 free messages left today</span>
      </div>
      <Card className="space-y-4">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "ml-auto w-fit max-w-[85%] rounded-3xl bg-primary px-4 py-2.5 text-sm text-primary-foreground" : "max-w-[92%] text-sm leading-relaxed [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-2"}>
            {m.role === "assistant" ? (m.content ? <ReactMarkdown>{m.content}</ReactMarkdown> : <span className="animate-pulse text-muted-foreground">Thinking…</span>) : m.content}
          </div>
        ))}
        {err && <p className="text-sm text-destructive">{err}</p>}
        <div ref={end} />
        {msgs.length === 1 && (
          <div className="flex flex-wrap gap-2">{STARTERS.map((s) => <Chip key={s} onClick={() => send(s)}>{s}</Chip>)}</div>
        )}
      </Card>
      <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="glass flex items-end gap-2 rounded-3xl p-2">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={1} placeholder={left > 0 ? "Type what's going on…" : "Daily free messages used. Back tomorrow."}
          disabled={left <= 0}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(text); } }}
          className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none" />
        {busy ? (
          <button type="button" aria-label="Stop" onClick={() => abort.current?.abort()} className="grid size-10 place-items-center rounded-full bg-secondary"><Square className="size-4" /></button>
        ) : (
          <button type="submit" aria-label="Send" disabled={!text.trim() || left <= 0} className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"><Send className="size-4" /></button>
        )}
      </form>
    </div>
  );
}
