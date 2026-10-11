import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Card, Button, Chip, Eyebrow } from "./ui";
import { useExtra, setExtra } from "@/lib/store";
import { payoffPlan, installmentSchedule } from "@/lib/debt";

const inp = "rounded-2xl bg-muted px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export function DebtOrganizer() {
  const x = useExtra();
  const [f, setF] = useState({ name: "", balance: "", rate: "", min: "" });
  const [budget, setBudget] = useState("300");
  const [strategy, setStrategy] = useState<"snowball" | "avalanche">("snowball");
  const plan = payoffPlan(x.debts, Number(budget) || 0, strategy);
  const other = payoffPlan(x.debts, Number(budget) || 0, strategy === "snowball" ? "avalanche" : "snowball");
  const [day, setDay] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + (now.getDate() > day ? 1 : 0), day);
  const rows = installmentSchedule(x.debts, Number(budget) || 0, strategy, start);
  const total = x.debts.reduce((s, d) => s + d.balance, 0);

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name || !Number(f.balance)) return;
    setExtra((s) => ({ ...s, debts: [...s.debts, { id: crypto.randomUUID(), name: f.name, balance: +f.balance, rate: +f.rate || 0, min: +f.min || 0 }] }));
    setF({ name: "", balance: "", rate: "", min: "" });
  }

  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Debt organizer</h2>
        <p className="mt-1 text-sm text-muted-foreground">Private to you — saved to your account when signed in. Lay it all out once — then it's just a plan.</p>
      </div>
      <form onSubmit={add} className="grid grid-cols-2 gap-2 md:grid-cols-5">
        <input className={inp + " col-span-2 md:col-span-1"} placeholder="Name (e.g. Card)" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className={inp} inputMode="decimal" placeholder="Balance" value={f.balance} onChange={(e) => setF({ ...f, balance: e.target.value })} />
        <input className={inp} inputMode="decimal" placeholder="APR %" value={f.rate} onChange={(e) => setF({ ...f, rate: e.target.value })} />
        <input className={inp} inputMode="decimal" placeholder="Min / month" value={f.min} onChange={(e) => setF({ ...f, min: e.target.value })} />
        <Button type="submit" variant="solid" size="sm" className="h-auto">Add</Button>
      </form>
      {x.debts.length > 0 && (
        <ul className="space-y-2">
          {x.debts.map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3 text-sm">
              <span className="font-medium">{d.name}</span>
              <span className="flex items-center gap-3 text-muted-foreground">{d.balance.toLocaleString()} · {d.rate}% · min {d.min}
                <button aria-label={`Remove ${d.name}`} onClick={() => setExtra((s) => ({ ...s, debts: s.debts.filter((y) => y.id !== d.id) }))}><Trash2 className="size-4" /></button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Chip active={strategy === "snowball"} onClick={() => setStrategy("snowball")}>Snowball (smallest first)</Chip>
        <Chip active={strategy === "avalanche"} onClick={() => setStrategy("avalanche")}>Avalanche (highest rate first)</Chip>
        <label className="ml-auto flex items-center gap-2 text-sm">Monthly budget
          <input className={inp + " w-24"} inputMode="decimal" value={budget} onChange={(e) => setBudget(e.target.value)} /></label>
      </div>
      {x.debts.length > 0 && (plan.feasible ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-muted p-4"><Eyebrow>Debt-free in</Eyebrow><p className="mt-1 font-display text-2xl font-semibold">{plan.months} months</p></div>
          <div className="rounded-2xl bg-muted p-4"><Eyebrow>Total interest</Eyebrow><p className="mt-1 font-display text-2xl font-semibold">{plan.interest.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{other.interest < plan.interest ? `Other method saves ${(plan.interest - other.interest).toFixed(0)}` : "Best on interest"}</p></div>
          <div className="rounded-2xl bg-muted p-4"><Eyebrow>Pay off order</Eyebrow><p className="mt-1 text-sm">{plan.order.join(" → ")}</p></div>
          <p className="text-xs text-muted-foreground sm:col-span-3">Total owed {total.toLocaleString()}. Estimates only — talk to a free debt advice service before big decisions.</p>
        </div>
      ) : null)}
      {x.debts.length > 0 && rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">Scheduled installments</h3>
            <span className="ml-auto text-sm text-muted-foreground">Due day</span>
            {[1, 15, 28].map((d) => <Chip key={d} active={day === d} onClick={() => setDay(d)}>{d}</Chip>)}
          </div>
          <div className="overflow-x-auto rounded-2xl bg-muted">
            <table className="w-full text-left text-xs">
              <thead className="text-muted-foreground"><tr><th className="p-2">#</th><th className="p-2">Due</th><th className="p-2">Pay</th><th className="p-2">Principal</th><th className="p-2">Interest</th><th className="p-2">Left</th></tr></thead>
              <tbody>
                {(showAll ? rows : rows.slice(0, 12)).map((r) => (
                  <tr key={r.month} className="border-t border-border">
                    <td className="p-2">{r.month}</td>
                    <td className="p-2 whitespace-nowrap">{new Date(r.date + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "2-digit" })}</td>
                    <td className="p-2">{r.payment.toLocaleString()}</td>
                    <td className="p-2">{r.principal.toLocaleString()}</td>
                    <td className="p-2">{r.interest.toLocaleString()}</td>
                    <td className="p-2">{r.remaining.toLocaleString()}{r.paidOff.length > 0 && <span className="ml-1 text-primary">✓ {r.paidOff.join(", ")} paid off</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2">
            {rows.length > 12 && <Button size="sm" onClick={() => setShowAll(!showAll)}>{showAll ? "Show less" : `Show all ${rows.length} months`}</Button>}
            <Button size="sm" onClick={() => { navigator.clipboard?.writeText(rows.map((r) => `${r.date}  pay ${r.payment}  left ${r.remaining}`).join("\n")); }}>Copy schedule</Button>
          </div>
        </div>
      )}
      {x.debts.length > 0 && !plan.feasible && (<p className="text-sm text-destructive">Budget is below your minimum payments. A free debt advice service can help negotiate.</p>)}
    </Card>
  );
}
