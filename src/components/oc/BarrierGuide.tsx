import { ExternalLink, AlertTriangle } from "lucide-react";
import { Card } from "@/components/oc/ui";

const BANKS = [
  { bank: "Monzo", how: "Card → Gambling block → Turn on. Turning it off takes 48 hours." },
  { bank: "Barclays / Lloyds / Starling", how: "App → Card settings → Gambling block. Most UK banks add a cooling-off delay before it can be removed." },
  { bank: "Revolut", how: "Card → Settings → Gambling transactions → Block." },
  { bank: "Chase / Wells Fargo / other US banks", how: "Many US banks have no in-app toggle yet. Call the number on your card and ask to block gambling merchants (code 7995)." },
  { bank: "Any bank", how: "Not sure? Search your bank's app for “gambling” or ask in branch. Ask them to add a delay before removal." },
];

const EXCLUSION = [
  { name: "GAMSTOP (UK, all licensed online sites)", url: "https://www.gamstop.co.uk" },
  { name: "MOSES (UK, betting shops)", url: "https://self-exclusion.co.uk" },
  { name: "US state self-exclusion (search your state gaming board)", url: "https://www.ncpgambling.org/help-treatment/self-exclusion/" },
  { name: "BetStop (Australia)", url: "https://www.betstop.gov.au" },
  { name: "BetBlocker (free blocker, any country)", url: "https://betblocker.org" },
  { name: "Gamban (blocker app)", url: "https://gamban.com" },
];

export function BarrierGuide() {
  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Add more walls</h2>
        <p className="text-sm text-muted-foreground">Layers work best together. Each takes a few minutes and costs nothing.</p>
      </div>
      <div className="flex gap-3 rounded-2xl bg-muted p-4 text-sm">
        <AlertTriangle className="size-5 shrink-0 text-accent" />
        <p>No blocker — on a phone or at a bank — is foolproof. Their job is to add time and friction between an urge and a bet, so you have space to pause.</p>
      </div>
      <div>
        <p className="mb-2 font-medium">1 · Block gambling on your bank card</p>
        <ul className="space-y-2">{BANKS.map((b) => <li key={b.bank} className="rounded-2xl bg-muted px-4 py-3 text-sm"><span className="font-medium">{b.bank}:</span> <span className="text-muted-foreground">{b.how}</span></li>)}</ul>
        <p className="mt-2 text-xs text-muted-foreground">Bank menus change — check your bank's own help page if a step doesn't match.</p>
      </div>
      <div>
        <p className="mb-2 font-medium">2 · Self-exclude from gambling sites</p>
        <div className="grid gap-2 sm:grid-cols-2">{EXCLUSION.map((e) => (
          <a key={e.name} href={e.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 rounded-2xl bg-muted px-4 py-3 text-sm">{e.name}<ExternalLink className="size-4 shrink-0 text-muted-foreground" /></a>
        ))}</div>
      </div>
    </Card>
  );
}
