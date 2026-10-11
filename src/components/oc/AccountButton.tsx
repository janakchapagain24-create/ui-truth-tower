import { Link } from "@tanstack/react-router";
import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function AccountButton() {
  const { user, ready } = useAuth();
  if (!ready) return <span className="size-10" />;
  if (!user) return <Link to="/auth" className="glass flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium"><UserRound className="size-4" />Sign in</Link>;
  return (
    <button aria-label="Sign out" title={`Signed in as ${user.email}`} onClick={() => supabase.auth.signOut()}
      className="glass grid size-10 place-items-center rounded-full"><LogOut className="size-4" /></button>
  );
}
