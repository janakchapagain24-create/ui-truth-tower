import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Check } from "lucide-react";
import { Button, Chip, pill } from "@/components/oc/ui";
import { setState, useStore } from "@/lib/store";

export const Route = createFileRoute("/app/emergency")({
  head: () => ({ meta: [{ title: "Emergency mode — One Chance" }, { name: "description", content: "Pause. Your protection is active." }, { property: "og:title", content: "Emergency mode — One Chance" }, { property: "og:description", content: "Pause. Your protection is active." }] }),
  component: Emergency,
});

const TRIGGERS = ["Stress", "Boredom", "Debt", "Want to recover a loss", "Saw gambling content", "Someone invited me", "Loneliness", "Other"];
const FEEL = ["Much better", "A bit better", "The same", "Still a strong urge"];
const TASKS = ["Drink a glass of water", "Step away from the screen where the urge started", "Write down one thing you want next month", "Walk or stretch for five minutes", "Message someone — about anything"];

function Emergency() {
  const s = useStore();
  const [step, setStep] = useState(0);
  const [trigger, setTrigger] = useState("");
  const [secs, setSecs] = useState(20 * 60);
  const [task, setTask] = useState(0);
  const [feel, setFeel] = useState("");

  useEffect(() => {
    if (step !== 3) return;
    const t = setInterval(() => setSecs((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const wrap = (c: React.ReactNode) => <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center text-center fade-up" key={step}>{c}</div>;

  if (step === 0) return wrap(<>
    <span className="relative mx-auto mb-10 grid size-40 place-items-center">
      <span className="breathe absolute inset-0 rounded-full bg-gradient-accent opacity-40 blur-xl" />
      <ShieldCheck className="relative size-14 text-accent" />
    </span>
    <h1 className="text-4xl font-semibold">Pause.</h1>
    <p className="mt-3 text-lg text-muted-foreground">Your protection is active. Breathe with the circle for a moment.</p>
    <Button variant="solid" size="lg" className="mx-auto mt-10" onClick={() => setStep(1)}>I'm here</Button>
  </>);

  if (step === 1) return wrap(<>
    <h1 className="text-3xl font-semibold">What triggered this?</h1>
    <div className="mt-8 flex flex-wrap justify-center gap-2">
      {TRIGGERS.map((t) => <Chip key={t} active={trigger === t} onClick={() => setTrigger(t)}>{t}</Chip>)}
    </div>
    {trigger === "Want to recover a loss" && <p className="mt-6 text-sm text-muted-foreground">That pull is real — and it's the one that costs the most. You don't have to win it back. You can build forward.</p>}
    <Button variant="solid" size="lg" className="mx-auto mt-10" disabled={!trigger} onClick={() => setStep(2)}>Next</Button>
  </>);

  if (step === 2) return wrap(<>
    <h1 className="text-3xl font-semibold">What would help right now?</h1>
    <div className="mt-8 grid gap-3">
      <Link to="/app/coach" className={pill({ variant: "glass", size: "lg" })}>Talk to AI</Link>
      <button className={pill({ variant: "glass", size: "lg" })} onClick={() => alert(s.trustedPerson ? `Reach out to ${s.trustedPerson.name}: ${s.trustedPerson.contact}` : "Add a trusted person on the Protect page.")}>Contact my person</button>
      <Button variant="accent" size="lg" onClick={() => setStep(3)}>20-minute emergency mission</Button>
      <Link to="/" className={pill({ variant: "ghost", size: "lg" })}>Leave the app</Link>
    </div>
  </>);

  if (step === 3) {
    const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");
    const allDone = task >= TASKS.length;
    return wrap(<>
      <p className="font-display text-6xl font-semibold tabular-nums">{mm}:{ss}</p>
      <p className="mt-2 text-sm text-muted-foreground">{Math.min(task, TASKS.length)} of {TASKS.length} done</p>
      <div className="mx-auto mt-3 flex gap-1.5">
        {TASKS.map((_, i) => <span key={i} className={`h-1.5 w-8 rounded-full ${i < task ? "bg-gradient-accent" : "bg-secondary"}`} />)}
      </div>
      {!allDone ? (
        <div key={task} className="glass mt-8 rounded-3xl p-6 fade-up">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Step {task + 1}</p>
          <p className="mt-2 text-xl font-semibold">{TASKS[task]}</p>
          <div className="mt-6 flex justify-center gap-2">
            <Button variant="solid" onClick={() => setTask((t) => t + 1)}><Check className="size-4" /> Done — next</Button>
            <Button variant="ghost" onClick={() => setTask((t) => t + 1)}>Skip</Button>
          </div>
        </div>
      ) : (
        <div className="glass mt-8 rounded-3xl p-6 fade-up">
          <p className="text-xl font-semibold">All five done. That's real protection.</p>
        </div>
      )}
      {task > 0 && !allDone && (
        <ul className="mt-4 space-y-1 text-left text-sm text-muted-foreground">
          {TASKS.slice(0, task).map((x) => <li key={x} className="flex items-center gap-2"><Check className="size-4 text-accent" /><span className="line-through">{x}</span></li>)}
        </ul>
      )}
      <Button variant={allDone ? "solid" : "ghost"} size="lg" className="mx-auto mt-8" onClick={() => setStep(4)}>I'm ready to check in</Button>
    </>);
  }

  return wrap(feel ? <>
    <h1 className="text-3xl font-semibold">You protected the next decision.</h1>
    <p className="mt-3 text-muted-foreground">That counts. It's yours.</p>
    <div className="mt-10 flex justify-center gap-3">
      <Link to="/app" className={pill({ variant: "solid" })}>Back home</Link>
      {feel === "Still a strong urge" && <Link to="/app/coach" className={pill({ variant: "glass" })}>Talk to AI</Link>}
    </div>
  </> : <>
    <h1 className="text-3xl font-semibold">How do you feel now?</h1>
    <div className="mt-8 flex flex-wrap justify-center gap-2">
      {FEEL.map((f) => <Chip key={f} onClick={() => { setFeel(f); setState((x) => ({ ...x, urgesResisted: x.urgesResisted + 1 })); }}>{f}</Chip>)}
    </div>
  </>);
}
