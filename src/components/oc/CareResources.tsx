import { useState } from "react";
import { LifeBuoy, Phone, ExternalLink, X } from "lucide-react";

export const HELPLINES = [
  { region: "US", name: "1-800-GAMBLER (call or text)", tel: "18004262537", url: "https://www.1800gambler.net" },
  { region: "US", name: "988 Suicide & Crisis Lifeline", tel: "988", url: "https://988lifeline.org" },
  { region: "UK", name: "GamCare National Gambling Helpline", tel: "08088020133", url: "https://www.gamcare.org.uk" },
  { region: "Australia", name: "Gambling Help Online", tel: "1800858858", url: "https://www.gamblinghelponline.org.au" },
];
export const PEER = [
  { name: "Gamblers Anonymous meetings", url: "https://www.gamblersanonymous.org" },
  { name: "Gam-Anon (for family & friends)", url: "https://www.gam-anon.org" },
  { name: "SMART Recovery meetings", url: "https://smartrecovery.org" },
  { name: "Find help in other countries (Gambling Therapy)", url: "https://www.gamblingtherapy.org" },
];

export function HelplineList() {
  return (
    <div className="space-y-2 text-left">
      {HELPLINES.map((h) => (
        <a key={h.name} href={`tel:${h.tel}`} className="flex items-center justify-between gap-3 rounded-2xl bg-muted px-4 py-3 text-sm">
          <span><span className="block text-xs text-muted-foreground">{h.region} · free, confidential</span>{h.name}</span>
          <Phone className="size-4 shrink-0 text-accent" />
        </a>
      ))}
      <p className="pt-2 text-xs uppercase tracking-wider text-muted-foreground">Peer support</p>
      {PEER.map((p) => (
        <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3 text-sm">
          {p.name}<ExternalLink className="size-4 shrink-0 text-muted-foreground" />
        </a>
      ))}
      <p className="pt-1 text-xs text-muted-foreground">In immediate danger? Call your local emergency number.</p>
    </div>
  );
}

export function CareDrawerButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
        <LifeBuoy className="size-4 text-accent" /> Free helplines & support
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-4 backdrop-blur-sm sm:items-center" onClick={() => setOpen(false)}>
          <div className="glass max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Real people, free, 24/7</h2>
              <button aria-label="Close" onClick={() => setOpen(false)}><X className="size-5" /></button>
            </div>
            <HelplineList />
          </div>
        </div>
      )}
    </>
  );
}
