import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Sparkles, ArrowUp, X } from "lucide-react";

const CHIPS = [
  "How does the Solana Commitment Vault work?",
  "How will the iPhone & Android blocker work?",
  "Which Colosseum track fits One Chance?",
  "What's on the roadmap after the hackathon?",
];

type Msg = { role: "user" | "assistant"; content: string };

export function AskAiBox() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function ask(q: string) {
    if (!q.trim() || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q.trim() }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setInput(""); setBusy(true); setOpen(true);
    try {
      const res = await fetch("/api/docs-ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      if (!res.ok || !res.body) throw new Error(res.status === 429 ? "Too many questions — try again in a minute." : "AI is unavailable right now.");
      const reader = res.body.getReader(); const dec = new TextDecoder(); let acc = "";
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...next, { role: "assistant", content: acc }]);
        endRef.current?.scrollIntoView({ block: "nearest" });
      }
    } catch (e) {
      setMsgs([...next, { role: "assistant", content: (e as Error).message }]);
    } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl">
      {open && msgs.length > 0 && (
        <div className="glass mb-2 max-h-[55vh] overflow-y-auto rounded-3xl p-4 shadow-glow">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-primary" /> Docs AI</span>
            <button aria-label="Close" onClick={() => setOpen(false)}><X className="size-4" /></button>
          </div>
          <div className="space-y-3 text-sm">
            {msgs.map((m, i) => m.role === "user"
              ? <div key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-primary-foreground">{m.content}</div>
              : <div key={i} className="prose prose-sm max-w-none text-foreground dark:prose-invert">{m.content ? <ReactMarkdown>{m.content}</ReactMarkdown> : <span className="animate-pulse text-muted-foreground">Thinking…</span>}</div>)}
            <div ref={endRef} />
          </div>
        </div>
      )}
      {msgs.length === 0 && (
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
          {CHIPS.map((c) => <button key={c} onClick={() => ask(c)} className="glass shrink-0 rounded-full px-3 py-1.5 text-xs text-foreground">{c}</button>)}
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="glass flex items-center gap-2 rounded-full p-1.5 pl-4 shadow-glow">
        <Sparkles className="size-4 shrink-0 text-primary" />
        <input value={input} onChange={(e) => setInput(e.target.value)} onFocus={() => setOpen(true)} placeholder="Ask AI about One Chance…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        <button disabled={busy || !input.trim()} aria-label="Send" className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"><ArrowUp className="size-4" /></button>
      </form>
    </div>
  );
}
