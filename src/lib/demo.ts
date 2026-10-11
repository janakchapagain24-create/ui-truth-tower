import { MISSIONS } from "./missions";
import { getSnapshot, replaceAll } from "./store";

const BACKUP = "one-chance-pre-demo";
const today = () => new Date().toISOString().slice(0, 10);

export const isDemo = () => typeof window !== "undefined" && !!localStorage.getItem(BACKUP);

/** Load a realistic Day-14 recovery profile for judges. Saves the real data so it can be restored. */
export function enterDemo() {
  const { state, extra } = getSnapshot();
  if (!isDemo()) localStorage.setItem(BACKUP, JSON.stringify({ state, extra }));
  const d = today();
  replaceAll(
    {
      ...state,
      name: "Alex",
      protectionStart: new Date(Date.now() - 13 * 864e5).toISOString(),
      completed: Object.fromEntries(MISSIONS.slice(0, 3).map((m) => [m.id, d])),
      credits: 260,
      urgesResisted: 6,
      mood: { value: "Okay", date: d },
      trustedPerson: { name: "Sam", contact: "sam@example.com", status: "connected" },
      setbacks: [{ date: new Date(Date.now() - 9 * 864e5).toISOString().slice(0, 10), kind: "Slip — logged privately" }],
      goal: "Earn my first income from design within 90 days",
      skills: ["Design", "Writing", "Customer service"],
      resources: ["Phone", "Laptop", "Internet", "Time"],
    },
    {
      ...extra,
      surfMinutes: 42,
      pathStage: 2,
      planDone: ["Week 1: protection + routine", "Week 2: practice your top skill daily", "Month 1: steady footing"],
      debts: [
        { id: "d1", name: "Credit card", balance: 2400, rate: 24, min: 80 },
        { id: "d2", name: "Payday loan", balance: 900, rate: 40, min: 60 },
        { id: "d3", name: "Friend", balance: 1500, rate: 0, min: 50 },
      ],
      pledges: [{ days: 30, sol: 0.1, partner: "Sam", sig: "demo", date: new Date(Date.now() - 6 * 864e5).toISOString(), wallet: "Demo wallet" }],
    },
  );
}

export function exitDemo() {
  const raw = localStorage.getItem(BACKUP);
  if (!raw) return;
  localStorage.removeItem(BACKUP);
  const { state, extra } = JSON.parse(raw);
  replaceAll(state, extra);
}
