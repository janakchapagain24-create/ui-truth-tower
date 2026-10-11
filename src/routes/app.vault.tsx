import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, ExternalLink, Lock } from "lucide-react";
import { Card, Button, Chip, PageHeader, Eyebrow, DemoNote } from "@/components/oc/ui";
import { useExtra, setExtra, useStore, protectionDay } from "@/lib/store";

export const Route = createFileRoute("/app/vault")({
  head: () => ({ meta: [
    { title: "Commitment Vault — One Chance" },
    { name: "description", content: "Record a recovery commitment on Solana, with an optional stake held by your trusted person." },
    { property: "og:title", content: "Commitment Vault — One Chance" },
    { property: "og:description", content: "Record a recovery commitment on Solana, with an optional stake held by your trusted person." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Vault,
});

const DAYS = [7, 30, 90, 180];

function Vault() {
  const x = useExtra();
  const s = useStore();
  const [addr, setAddr] = useState("");
  const [bal, setBal] = useState<number | null>(null);
  const [days, setDays] = useState(30);
  const [sol, setSol] = useState("0");
  const [partner, setPartner] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  async function run(label: string, fn: () => Promise<void>) {
    setErr(""); setBusy(label);
    try { await fn(); } catch (e) { setErr((e as Error).message || "Something went wrong"); } finally { setBusy(""); }
  }
  const connect = () => run("connect", async () => {
    const { getProvider, getBalance } = await import("@/lib/solana");
    const p = getProvider();
    if (!p) { window.open("https://phantom.app/download", "_blank"); throw new Error("Install a Solana wallet (Phantom, Solflare or Backpack), set it to Devnet, then try again."); }
    const r = await p.connect(); const a = r.publicKey.toString();
    setAddr(a); setBal(await getBalance(a));
  });
  const drop = () => run("airdrop", async () => {
    const { airdrop, getBalance } = await import("@/lib/solana");
    await airdrop(addr); setBal(await getBalance(addr));
  });
  const commit = () => run("pledge", async () => {
    const stake = Number(sol) || 0;
    if (stake > 0 && !partner) throw new Error("Add your trusted person's wallet to hold the stake.");
    const { pledge, getBalance } = await import("@/lib/solana");
    const sig = await pledge(addr, days, stake, partner.trim());
    setExtra((v) => ({ ...v, pledges: [{ days, sol: stake, partner: partner.trim(), sig, date: new Date().toISOString(), wallet: addr }, ...v.pledges] }));
    setBal(await getBalance(addr));
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Built on Solana" title="Commitment Vault" sub="Make a promise to yourself that can't be quietly erased. Written on-chain, with no mention of gambling." />
      <DemoNote>Runs on Solana Devnet (test money only). Your stake goes to your trusted person, who returns it when you reach your milestone.</DemoNote>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-secondary"><Wallet className="size-5" /></span>
          <div>
            <p className="font-semibold">{addr ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : "No wallet connected"}</p>
            <p className="text-xs text-muted-foreground">{bal !== null ? `${bal.toFixed(3)} SOL on Devnet` : "Phantom · Solflare · Backpack"}</p>
          </div>
        </div>
        {addr ? (
          <Button variant="ghost" size="sm" onClick={drop} disabled={!!busy}>{busy === "airdrop" ? "Requesting…" : "Get 1 test SOL"}</Button>
        ) : (
          <Button variant="solid" size="sm" onClick={connect} disabled={!!busy}>{busy === "connect" ? "Connecting…" : "Connect wallet"}</Button>
        )}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">New commitment</h2>
        <div>
          <Eyebrow className="mb-2">I commit to</Eyebrow>
          <div className="flex flex-wrap gap-2">{DAYS.map((d) => <Chip key={d} active={days === d} onClick={() => setDays(d)}>{d} days</Chip>)}</div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm"><Eyebrow className="mb-2">Optional stake (SOL)</Eyebrow>
            <input inputMode="decimal" value={sol} onChange={(e) => setSol(e.target.value)} className="w-full rounded-2xl bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-ring" /></label>
          <label className="text-sm"><Eyebrow className="mb-2">Trusted person's wallet</Eyebrow>
            <input value={partner} onChange={(e) => setPartner(e.target.value)} placeholder="Solana address" className="w-full rounded-2xl bg-muted px-4 py-3 outline-none focus:ring-2 focus:ring-ring" /></label>
        </div>
        <Button variant="solid" onClick={commit} disabled={!addr || !!busy}><Lock className="size-4" /> {busy === "pledge" ? "Confirm in wallet…" : "Sign commitment"}</Button>
        {err && <p className="text-sm text-destructive">{err}</p>}
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Your commitments</h2>
        {x.pledges.length === 0 ? <p className="text-sm text-muted-foreground">None yet. You're on day {protectionDay(s)} of protection.</p> : (
          <ul className="space-y-2">{x.pledges.map((p) => {
            const done = Math.floor((Date.now() - new Date(p.date).getTime()) / 864e5);
            return (
              <li key={p.sig} className="rounded-2xl bg-muted p-4 text-sm">
                <div className="flex items-center justify-between"><span className="font-medium">{p.days}-day commitment{p.sol ? ` · ${p.sol} SOL` : ""}</span>
                  <a href={`https://explorer.solana.com/tx/${p.sig}?cluster=devnet`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs underline">On-chain <ExternalLink className="size-3" /></a></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-background"><div className="h-full bg-gradient-accent" style={{ width: `${Math.min(100, (done / p.days) * 100)}%` }} /></div>
                <p className="mt-1 text-xs text-muted-foreground">{Math.min(done, p.days)} / {p.days} days{done >= p.days ? " — milestone reached. Ask for your stake back." : ""}</p>
              </li>
            );
          })}</ul>
        )}
      </Card>
    </div>
  );
}
