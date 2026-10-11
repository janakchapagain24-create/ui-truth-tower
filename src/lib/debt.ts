export type DebtIn = { name: string; balance: number; rate: number; min: number };
export type PlanResult = { months: number; interest: number; order: string[]; feasible: boolean };

/** Simulate paying debts monthly with a fixed total budget. */
export function payoffPlan(debts: DebtIn[], budget: number, strategy: "snowball" | "avalanche"): PlanResult {
  const list = debts.filter((d) => d.balance > 0).map((d) => ({ ...d }));
  const sorted = [...list].sort((a, b) => strategy === "snowball" ? a.balance - b.balance : b.rate - a.rate);
  const order = sorted.map((d) => d.name);
  const minTotal = list.reduce((s, d) => s + d.min, 0);
  if (!list.length) return { months: 0, interest: 0, order, feasible: true };
  if (budget < minTotal) return { months: 0, interest: 0, order, feasible: false };
  let months = 0, interest = 0;
  while (sorted.some((d) => d.balance > 0.005) && months < 600) {
    months++;
    for (const d of sorted) { if (d.balance > 0) { const i = d.balance * (d.rate / 100 / 12); interest += i; d.balance += i; } }
    let left = budget;
    for (const d of sorted) { if (d.balance > 0) { const p = Math.min(d.min, d.balance); d.balance -= p; left -= p; } }
    for (const d of sorted) { if (d.balance > 0 && left > 0) { const p = Math.min(left, d.balance); d.balance -= p; left -= p; } }
  }
  return { months, interest: Math.round(interest * 100) / 100, order, feasible: months < 600 };
}

export type Installment = { month: number; date: string; payment: number; interest: number; principal: number; remaining: number; paidOff: string[] };

/** Month-by-month installment schedule. `start` is the first due date. */
export function installmentSchedule(debts: DebtIn[], budget: number, strategy: "snowball" | "avalanche", start: Date): Installment[] {
  const list = debts.filter((d) => d.balance > 0).map((d) => ({ ...d }));
  const sorted = [...list].sort((a, b) => strategy === "snowball" ? a.balance - b.balance : b.rate - a.rate);
  if (!list.length || budget < list.reduce((s, d) => s + d.min, 0)) return [];
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const rows: Installment[] = [];
  for (let m = 1; m <= 600 && sorted.some((d) => d.balance > 0.005); m++) {
    let interest = 0, paid = 0;
    for (const d of sorted) if (d.balance > 0) { const i = d.balance * (d.rate / 100 / 12); interest += i; d.balance += i; }
    let left = budget;
    for (const d of sorted) if (d.balance > 0) { const p = Math.min(d.min, d.balance); d.balance -= p; left -= p; paid += p; }
    for (const d of sorted) if (d.balance > 0 && left > 0) { const p = Math.min(left, d.balance); d.balance -= p; left -= p; paid += p; }
    const paidOff = sorted.filter((d) => d.balance <= 0.005 && !rows.some((r) => r.paidOff.includes(d.name))).map((d) => d.name);
    for (const d of sorted) if (d.balance <= 0.005) d.balance = 0;
    const dt = new Date(start.getFullYear(), start.getMonth() + m - 1, start.getDate());
    rows.push({ month: m, date: dt.toISOString().slice(0, 10), payment: r2(paid), interest: r2(interest), principal: r2(paid - interest), remaining: r2(sorted.reduce((s, d) => s + d.balance, 0)), paidOff });
  }
  return rows;
}
