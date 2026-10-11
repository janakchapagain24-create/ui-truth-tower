import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button, Card } from "@/components/oc/ui";
import { Logo } from "@/components/oc/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign in — One Chance" },
    { name: "description", content: "Create your One Chance account so your streaks, posts and debt plan follow you on every device." },
    { property: "og:title", content: "Sign in — One Chance" },
    { property: "og:description", content: "Keep your progress safe across devices." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

const inp = "w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function AuthPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) nav({ to: "/app" }); }, [user, nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { data, error } = await supabase.auth.signUp({ email, password: pw, options: { emailRedirectTo: window.location.origin + "/app", data: { display_name: name || undefined } } });
        if (error) throw error;
        if (!data.session) toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setBusy(false); }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error("Google sign-in didn't work. Try again.");
  }

  return (
    <div className="grid min-h-screen place-items-center px-5 py-10">
      <Card className="w-full max-w-sm space-y-5">
        <Link to="/"><Logo /></Link>
        <div>
          <h1 className="font-display text-2xl font-semibold">{mode === "up" ? "Start again, saved" : "Welcome back"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your streaks, posts and debt plan stay with you on every device. Your recovery stays private.</p>
        </div>
        <Button variant="glass" className="w-full" onClick={google}>Continue with Google</Button>
        <form onSubmit={submit} className="space-y-3">
          {mode === "up" && <input className={inp} placeholder="First name (shown to members)" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />}
          <input className={inp} type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={inp} type="password" required minLength={6} placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <Button type="submit" variant="solid" className="w-full" disabled={busy}>{mode === "up" ? "Create account" : "Sign in"}</Button>
        </form>
        <button className="w-full text-center text-sm text-muted-foreground" onClick={() => setMode(mode === "up" ? "in" : "up")}>
          {mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </Card>
    </div>
  );
}
