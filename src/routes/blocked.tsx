import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { pill } from "@/components/oc/ui";

export const Route = createFileRoute("/blocked")({
  head: () => ({ meta: [{ title: "Destination blocked — One Chance" }, { name: "description", content: "This destination is blocked by your One Chance protection." }, { property: "og:title", content: "Destination blocked — One Chance" }, { property: "og:description", content: "Let's protect the next decision." }, { name: "robots", content: "noindex" }] }),
  component: Blocked,
});

function Blocked() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <div className="max-w-lg fade-up">
        <span className="mx-auto mb-8 grid size-20 place-items-center rounded-full bg-gradient-accent shadow-glow">
          <ShieldCheck className="size-10 text-accent-foreground" />
        </span>
        <h1 className="text-4xl font-semibold">This destination is blocked.</h1>
        <p className="mt-4 text-muted-foreground">It appears to involve gambling and your One Chance protection is active.</p>
        <p className="mt-6 text-lg">You don't need to win the loss back. Let's protect the next decision.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/app/emergency" className={pill({ variant: "accent" })}>Emergency mission</Link>
          <Link to="/app/coach" className={pill({ variant: "glass" })}>Talk to AI</Link>
          <Link to="/app/protect" className={pill({ variant: "glass" })}>Contact my person</Link>
        </div>
      </div>
    </div>
  );
}
