import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, Timer } from "lucide-react";
import { Card, PageHeader, Eyebrow } from "@/components/oc/ui";

export const Route = createFileRoute("/app/games")({
  head: () => ({ meta: [
    { title: "Games — One Chance" },
    { name: "description", content: "Free, ad-free games to ride out an urge and pass the time." },
    { property: "og:title", content: "Games — One Chance" },
    { property: "og:description", content: "Free, ad-free games to ride out an urge and pass the time." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Games,
});

export const GAMES = [
  { id: "2048", name: "2048", tag: "Puzzle", emoji: "🔢", url: "https://gabrielecirulli.github.io/2048/" },
  { id: "tetris", name: "Tetris", tag: "Classic", emoji: "🧱", url: "https://chvin.github.io/react-tetris/" },
  { id: "flappy", name: "Floppy Bird", tag: "Arcade", emoji: "🐤", url: "https://nebezb.com/floppybird/" },
  { id: "clumsy", name: "Clumsy Bird", tag: "Arcade", emoji: "🪽", url: "https://ellisonleao.github.io/clumsy-bird/" },
  { id: "mines", name: "Mines", tag: "Logic", emoji: "💣", url: "https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/mines.html" },
  { id: "net", name: "Net", tag: "Logic", emoji: "🔌", url: "https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/net.html" },
  { id: "fifteen", name: "Fifteen", tag: "Puzzle", emoji: "🧩", url: "https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/fifteen.html" },
  { id: "untangle", name: "Untangle", tag: "Calm", emoji: "🕸️", url: "https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/untangle.html" },
];

function Games() {
  const [open, setOpen] = useState<(typeof GAMES)[number] | null>(null);
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!open) return;
    setSecs(0);
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [open]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Arcade" title="Play it out" sub="Urges peak and fade in about 15 minutes. Free, ad-free games to get you through — no betting, ever." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {GAMES.map((g) => (
          <button key={g.id} onClick={() => setOpen(g)} className="text-left">
            <Card className="h-full transition hover:-translate-y-0.5 hover:bg-secondary">
              <span className="text-4xl">{g.emoji}</span>
              <p className="mt-4 font-semibold">{g.name}</p>
              <Eyebrow className="mt-1">{g.tag}</Eyebrow>
            </Card>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-2xl">{open.emoji}</span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{open.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Timer className="size-3" /> Urge surfed {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, "0")}
                </p>
              </div>
            </div>
            <button aria-label="Close game" onClick={() => setOpen(null)} className="glass grid size-10 place-items-center rounded-full"><X className="size-4" /></button>
          </div>
          <iframe title={open.name} src={open.url} className="w-full flex-1 border-0 bg-card" allow="fullscreen; autoplay" />
        </div>
      )}
    </div>
  );
}
