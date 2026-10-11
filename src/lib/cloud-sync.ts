import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { getSnapshot, replaceAll, subscribeAll } from "./store";

let stop: (() => void) | null = null;
let currentUser: string | null = null;

/** Keeps streaks, missions, credits and debts in the user's cloud account. Call once from the root. */
export function startCloudSync() {
  if (typeof window === "undefined") return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    const uid = session?.user.id ?? null;
    if (uid === currentUser) return;
    currentUser = uid;
    stop?.(); stop = null;
    if (uid) void attach(uid);
  });
  return () => data.subscription.unsubscribe();
}

async function attach(uid: string) {
  const { data: row } = await supabase.from("user_state").select("state, extra").eq("user_id", uid).maybeSingle();
  if (currentUser !== uid) return;
  if (row && Object.keys((row.state as object) ?? {}).length > 0) {
    replaceAll(row.state as never, row.extra as never);
  } else {
    await push(uid);
  }
  let t: ReturnType<typeof setTimeout> | undefined;
  const unsub = subscribeAll(() => { clearTimeout(t); t = setTimeout(() => void push(uid), 800); });
  stop = () => { clearTimeout(t); unsub(); };
}

async function push(uid: string) {
  const { state, extra } = getSnapshot();
  await supabase.from("user_state").upsert({ user_id: uid, state: state as unknown as Json, extra: extra as unknown as Json, updated_at: new Date().toISOString() });
}
