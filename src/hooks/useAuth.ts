import { useSyncExternalStore } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = { session: Session | null; ready: boolean };
let auth: AuthState = { session: null, ready: false };
const subs = new Set<() => void>();
let started = false;

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  supabase.auth.onAuthStateChange((_e, session) => {
    auth = { session, ready: true };
    subs.forEach((s) => s());
  });
  supabase.auth.getSession().then(({ data }) => {
    auth = { session: data.session, ready: true };
    subs.forEach((s) => s());
  });
}

const SERVER: AuthState = { session: null, ready: false };

export function useAuth() {
  const a = useSyncExternalStore(
    (l) => { start(); subs.add(l); return () => subs.delete(l); },
    () => auth,
    () => SERVER,
  );
  return { ...a, user: a.session?.user ?? null };
}
