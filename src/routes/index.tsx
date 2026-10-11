import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import {
  Shield, Target, MessageCircle, Hammer, Briefcase, Users, ArrowRight,
  ShieldCheck, Siren, Flame, Wallet, Sparkles, ChevronDown,
} from "lucide-react";
import { Logo } from "@/components/oc/Logo";
import { ThemeToggle } from "@/components/oc/ThemeToggle";
import { InstallHint } from "@/components/oc/InstallHint";
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

const MARQUEE = [
  "Free forever", "No spins. No streaks to lose.", "48-hour guardian lock", "Solana commitment vault",
  "AI coach on your side", "Debt plan that fits your life", "Real work, real credits", "A setback never erases progress",
];

const STATS = [
  { value: 700, suffix: "B", prefix: "$", label: "projected yearly gambling losses worldwide by 2028" },
  { value: 80, suffix: "M", prefix: "", label: "adults live with gambling disorder or problem gambling" },
  { value: 16, suffix: "%", prefix: "", label: "of online casino users may have a gambling disorder" },
];

const ease = [0.2, 0.7, 0.2, 1] as const;

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return <span ref={ref} className="font-display text-4xl font-semibold md:text-5xl">{prefix}{n}{suffix}</span>;
}

function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-40 -top-40 size-[34rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.6 0.1 200 / 45%), transparent 70%)" }}
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 80, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-40 top-20 size-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.6 0.08 280 / 35%), transparent 70%)" }}
        animate={{ x: [0, -70, 20, 0], y: [0, 60, -30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 size-[28rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.65 0.1 160 / 28%), transparent 70%)" }}
        animate={{ x: [0, 50, -40, 0], y: [0, -50, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function PhoneMockup() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  return (
    <motion.div
      className="relative mx-auto w-64 md:w-72"
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.5, ease }}
    >
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <div className="glass rounded-[2.5rem] p-3 shadow-glow">
          <div className="space-y-3 rounded-[2rem] bg-background/80 p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-accent"><ShieldCheck className="size-5 text-accent-foreground" /></span>
              <div><p className="text-sm font-semibold">Day 40 protected</p><p className="text-[10px] text-muted-foreground">Level 3 · Rebuilder</p></div>
            </div>
            <div className="rounded-2xl bg-muted p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Urge surfing</p>
              <div className="mt-2 flex items-center gap-2">
                <motion.span className="grid size-8 place-items-center rounded-full bg-destructive/20" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Flame className="size-4 text-destructive" />
                </motion.span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <motion.div className="h-full rounded-full bg-gradient-accent" initial={{ width: "8%" }} animate={{ width: "72%" }} transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-muted p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><Wallet className="size-3" />Debt plan</p>
              <p className="mt-1 text-sm font-semibold">14 months to free</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full w-2/5 rounded-full bg-gradient-accent" /></div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-muted p-3">
              <Sparkles className="size-4 text-accent" />
              <p className="text-[11px] text-muted-foreground">“You got through yesterday. This wave passes too.”</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="relative overflow-hidden border-y border-glass-border py-4" aria-hidden>
      <motion.div className="flex w-max gap-10 whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="size-1.5 rounded-full bg-accent" />{t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stagger = (i: number) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay: 0.15 + i * 0.12, ease } });

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
        className="flex justify-center px-4 pt-4"
      >
        <a href="/docs#solana" className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground transition hover:text-foreground">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          Built on Solana for the Colosseum Hackathon
          <span className="font-semibold text-foreground">View architecture →</span>
        </a>
      </motion.div>
      <motion.header
        className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-5"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
      >
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link to="/docs" className="rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">Docs</Link>
          <Link to="/app/vault" className="hidden rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline">Vault</Link>
          <ThemeToggle />
          <Link to="/app" className={pill({ variant: "solid", size: "sm" })}>Open app</Link>
        </nav>
      </motion.header>
      <InstallHint />

      {/* Hero */}
      <section ref={heroRef} className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 md:pt-20">
        <Aurora />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <div className="text-center md:text-left">
            <motion.div {...stagger(0)}><Eyebrow>Free protection · Real rebuilding</Eyebrow></motion.div>
            <motion.h1 {...stagger(1)} className="mt-6 text-5xl font-semibold leading-[1.05] md:text-7xl">
              Stop gambling.<br />
              <span className="text-gradient">Start rebuilding.</span>
            </motion.h1>
            <motion.p {...stagger(2)} className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:mx-0">
              You don't have to win it back. You can build forward.
            </motion.p>
            <motion.div {...stagger(3)} className="mt-10 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link to="/app" className={pill({ variant: "accent", size: "lg" })}>Start protected <ArrowRight className="size-4" /></Link>
              <Link to="/app/emergency" className={pill({ variant: "glass", size: "lg" })}><Siren className="size-4" />I need help right now</Link>
            </motion.div>
          </div>
          <PhoneMockup />
        </motion.div>
        <motion.div className="mt-14 flex justify-center text-muted-foreground" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="size-5" />
        </motion.div>
      </section>

      <Marquee />

      {/* Stats */}
      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-20 sm:grid-cols-3">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1}>
            <Card className="h-full text-center">
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
              <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
            </Card>
          </Reveal>
        ))}
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal className="mb-10 text-center">
          <Eyebrow>Everything in one place</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Built for the 2 a.m. moment</h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={(i % 3) * 0.08}>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Card className="h-full">
                  <span className="mb-5 grid size-11 place-items-center rounded-2xl bg-secondary"><Icon className="size-5 text-accent" /></span>
                  <h3 className="text-lg font-semibold">{t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </Card>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Promise */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <Reveal>
          <Card className="relative overflow-hidden p-10 text-center md:p-14">
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(50% 60% at 50% 0%, oklch(0.82 0.09 175 / 12%), transparent 70%)" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2 className="relative text-3xl font-semibold md:text-4xl">Protection never switches off because you didn't pay.</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              Core blocking and recovery missions are free forever. No spins, no streaks to lose, no lucky rewards. A setback never erases your progress.
            </p>
            <div className="relative mt-8 flex justify-center">
              <Link to="/app" className={pill({ variant: "accent", size: "lg" })}>Start protected <ArrowRight className="size-4" /></Link>
            </div>
          </Card>
        </Reveal>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-12 text-xs text-muted-foreground">
        One Chance supports recovery but cannot guarantee anyone will never gamble again. If you are in crisis, contact a local helpline.
      </footer>
    </div>
  );
}
