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
