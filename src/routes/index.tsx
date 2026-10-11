import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Target, MessageCircle, Hammer, Briefcase, Users, ArrowRight } from "lucide-react";
import { Logo } from "@/components/oc/Logo";
import { pill, Card, Eyebrow } from "@/components/oc/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "One Chance — Stop gambling. Start rebuilding." },
      { name: "description", content: "Free gambling protection, daily missions, an AI coach, skills and real work to help you rebuild." },
      { property: "og:title", content: "One Chance — Stop gambling. Start rebuilding." },
      { property: "og:description", content: "You don't have to win it back. You can build forward." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { icon: Shield, t: "Block gambling", d: "Casinos, sportsbooks, crypto betting and gambling ads. Free, always." },
  { icon: Target, t: "Interrupt the urge", d: "One button pauses the moment and walks you through it." },
  { icon: MessageCircle, t: "Coach on your side", d: "Private, practical AI support — 10 free messages every day." },
  { icon: Hammer, t: "Build skills", d: "Small daily missions that add up to something real." },
  { icon: Briefcase, t: "Find work", d: "Legitimate challenges from businesses. They never see your history." },
  { icon: Users, t: "Rebuild together", d: "People who get it. Share only what you choose." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <Link to="/app" className={pill({ variant: "solid", size: "sm" })}>Open app</Link>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-24 pt-20 text-center md:pt-32">
        <Eyebrow className="fade-up">Free protection · Real rebuilding</Eyebrow>
        <h1 className="fade-up mt-6 text-5xl font-semibold leading-[1.05] md:text-7xl">
          Stop gambling.<br /><span className="text-gradient">Start rebuilding.</span>
        </h1>
        <p className="fade-up mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          You don't have to win it back. You can build forward.
        </p>
        <div className="fade-up mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/app" className={pill({ variant: "accent", size: "lg" })}>Start protected <ArrowRight className="size-4" /></Link>
          <Link to="/app/emergency" className={pill({ variant: "glass", size: "lg" })}>I need help right now</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map(({ icon: Icon, t, d }, i) => (
          <Card key={t} className="fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="mb-5 grid size-11 place-items-center rounded-2xl bg-secondary"><Icon className="size-5 text-accent" /></span>
            <h3 className="text-lg font-semibold">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <Card className="p-10 text-center md:p-14">
          <h2 className="text-3xl font-semibold md:text-4xl">Protection never switches off because you didn't pay.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Core blocking and recovery missions are free forever. No spins, no streaks to lose, no lucky rewards. A setback never erases your progress.
          </p>
        </Card>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-12 text-xs text-muted-foreground">
        One Chance supports recovery but cannot guarantee anyone will never gamble again. If you are in crisis, contact a local helpline.
      </footer>
    </div>
  );
}
