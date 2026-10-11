import { useSyncExternalStore } from "react";
import { MISSIONS } from "./missions";

export type Mood = "Good" | "Okay" | "Stressed" | "Strong urge" | "Need someone to talk to";

export type State = {
  name: string;
  protectionStart: string; // ISO date
  completed: Record<string, string>; // missionId -> date completed
  credits: number;
  mood?: { value: Mood; date: string };
  categories: Record<string, boolean>;
  trustedPerson?: { name: string; contact: string; status: "pending" | "connected" };
  setbacks: { date: string; kind: string }[];
  goal: string;
  skills: string[];
  resources: string[];
  urgesResisted: number;
  reports: { domain: string; category: string; reason: string; date: string }[];
};

export const BLOCK_CATEGORIES = [
  "Casinos", "Sports betting", "Poker", "Bingo", "Lottery",
  "Crypto gambling", "Gambling affiliates", "Gambling ads", "Gambling redirects",
];

const KEY = "one-chance-v1";
const today = () => new Date().toISOString().slice(0, 10);

const initial: State = {
  name: "Friend",
  protectionStart: new Date(Date.now() - 23 * 864e5).toISOString(),
  completed: {},
  credits: 0,
  categories: Object.fromEntries(BLOCK_CATEGORIES.map((c) => [c, true])),
  setbacks: [],
  goal: "Earn my first income from a skill within 90 days",
  skills: ["Writing", "Customer service"],
  resources: ["Phone", "Internet"],
  urgesResisted: 0,
  reports: [],
};

let state: State = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch { /* ignore */ }
}

export function setState(fn: (s: State) => State) {
  load();
  state = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useStore(): State {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); },
    () => { load(); return state; },
    () => initial,
  );
}

export function protectionDay(s: State) {
  return Math.max(1, Math.floor((Date.now() - new Date(s.protectionStart).getTime()) / 864e5) + 1);
}

export function completeMission(id: string) {
  const m = MISSIONS.find((x) => x.id === id);
  if (!m) return;
  setState((s) => (s.completed[id] === today() ? s : {
    ...s, completed: { ...s.completed, [id]: today() }, credits: s.credits + m.reward,
  }));
}

export const isDoneToday = (s: State, id: string) => s.completed[id] === today();

export const LEVELS = ["Protect", "Stabilize", "Build", "Earn", "Grow", "Independent"];
export function levelOf(credits: number) {
  const idx = Math.min(LEVELS.length - 1, Math.floor(credits / 100));
  return { idx, name: LEVELS[idx], progress: credits % 100 };
}

// ---- Extended state (games rewards, coach usage, debts, pledges) ----
export type Debt = { id: string; name: string; balance: number; rate: number; min: number };
export type Pledge = { days: number; sol: number; partner: string; sig: string; date: string; wallet: string };
export type Extra = {
  gameRewards: Record<string, number>; // date -> rewards given that day
  surfMinutes: number;
  coach: { date: string; count: number };
  debts: Debt[];
  pledges: Pledge[];
};
const XKEY = "one-chance-extra-v1";
const xInitial: Extra = { gameRewards: {}, surfMinutes: 0, coach: { date: "", count: 0 }, debts: [], pledges: [] };
let xs: Extra = xInitial;
let xLoaded = false;
const xListeners = new Set<() => void>();
function xLoad() {
  if (xLoaded || typeof window === "undefined") return;
  xLoaded = true;
  try { const r = localStorage.getItem(XKEY); if (r) xs = { ...xInitial, ...JSON.parse(r) }; } catch { /* ignore */ }
}
export function setExtra(fn: (s: Extra) => Extra) {
  xLoad(); xs = fn(xs); localStorage.setItem(XKEY, JSON.stringify(xs)); xListeners.forEach((l) => l());
}
export function useExtra(): Extra {
  return useSyncExternalStore(
    (l) => { xLoad(); xListeners.add(l); l(); return () => xListeners.delete(l); },
    () => { xLoad(); return xs; },
    () => xInitial,
  );
}

export const GAME_REWARD = 20;
export const GAME_REWARD_MIN_SECONDS = 180;
export const GAME_REWARDS_PER_DAY = 3;
/** Award credits for riding out an urge in a game. Returns true if awarded. */
export function rewardUrgeSurf(seconds: number, day = today()): boolean {
  if (seconds < GAME_REWARD_MIN_SECONDS) return false;
  xLoad();
  if ((xs.gameRewards[day] ?? 0) >= GAME_REWARDS_PER_DAY) return false;
  setExtra((x) => ({ ...x, gameRewards: { ...x.gameRewards, [day]: (x.gameRewards[day] ?? 0) + 1 }, surfMinutes: x.surfMinutes + Math.floor(seconds / 60) }));
  setState((s) => ({ ...s, credits: s.credits + GAME_REWARD, urgesResisted: s.urgesResisted + 1 }));
  return true;
}

export const COACH_FREE_PER_DAY = 10;
export function coachRemaining(x: Extra, day = today()) {
  return x.coach.date === day ? Math.max(0, COACH_FREE_PER_DAY - x.coach.count) : COACH_FREE_PER_DAY;
}
export function useCoachMessage(day = today()) {
  setExtra((x) => ({ ...x, coach: { date: day, count: x.coach.date === day ? x.coach.count + 1 : 1 } }));
}

// ---- Cloud sync hooks ----
export const getSnapshot = () => { load(); xLoad(); return { state, extra: xs }; };
export function replaceAll(s: Partial<State>, e: Partial<Extra>) {
  load(); xLoad();
  state = { ...initial, ...s }; xs = { ...xInitial, ...e };
  localStorage.setItem(KEY, JSON.stringify(state)); localStorage.setItem(XKEY, JSON.stringify(xs));
  listeners.forEach((l) => l()); xListeners.forEach((l) => l());
}
export function subscribeAll(fn: () => void) {
  listeners.add(fn); xListeners.add(fn);
  return () => { listeners.delete(fn); xListeners.delete(fn); };
}
