import { DnsShield } from "@/components/oc/DnsShield";
import { LaunchGuide } from "@/components/oc/LaunchGuide";
import { BarrierGuide } from "@/components/oc/BarrierGuide";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Smartphone, Globe, Monitor, Apple } from "lucide-react";
import { Card, Eyebrow, Button, DemoNote, PageHeader, pill } from "@/components/oc/ui";
import { useStore, setState, protectionDay, BLOCK_CATEGORIES } from "@/lib/store";

export const Route = createFileRoute("/app/protect")({
  head: () => ({ meta: [{ title: "Protection — One Chance" }, { name: "description", content: "Your gambling protection status and settings." }, { property: "og:title", content: "Protection — One Chance" }, { property: "og:description", content: "Your gambling protection status and settings." }] }),
  component: ProtectPage,
});

const DEVICES = [
  { icon: Smartphone, name: "Android", status: "Native companion required" },
  { icon: Globe, name: "Browser", status: "Setup required" },
  { icon: Monitor, name: "Desktop", status: "Native companion required" },
  { icon: Apple, name: "iOS", status: "Native companion required" },
];

function ProtectPage() {
  const s = useStore();
  const [requested, setRequested] = useState(false);
  const [report, setReport] = useState({ domain: "", category: "Casinos", reason: "" });
  const [tp, setTp] = useState({ name: "", contact: "" });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Protect" title="Your shield" />

      <Card className="flex flex-col items-center py-12 text-center">
        <span className="relative grid size-32 place-items-center">
          <span className="breathe absolute inset-0 rounded-full bg-gradient-accent opacity-30 blur-2xl" />
          <span className="relative grid size-28 place-items-center rounded-full bg-gradient-accent shadow-glow">
            <ShieldCheck className="size-14 text-accent-foreground" />
          </span>
        </span>
        <p className="mt-6 font-display text-3xl font-semibold tracking-wide">PROTECTED</p>
        <p className="mt-1 text-muted-foreground">Day {protectionDay(s)} of your commitment</p>
        <div className="mt-8 grid w-full max-w-lg grid-cols-2 gap-3 text-left text-sm md:grid-cols-3">
          {[["Devices protected", "—"], ["Last sync", "—"], ["Heartbeat", "—"], ["Blocklist version", "—"], ["Last block event", "—"], ["Known rules", "—"]].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-muted p-3"><p className="text-xs text-muted-foreground">{k}</p><p className="mt-1 font-medium">{v}</p></div>
          ))}
        </div>
        <div className="mt-6 w-full max-w-lg"><DemoNote>Device-level blocking needs a native companion app. Values show "—" until a device is connected.</DemoNote></div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Blocked categories</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {BLOCK_CATEGORIES.map((c) => (
            <label key={c} className="flex cursor-pointer items-center justify-between rounded-2xl bg-muted px-4 py-3 text-sm">
              {c}
              <input type="checkbox" className="size-4 accent-[var(--accent)]" checked={s.categories[c] ?? true}
                onChange={(e) => {
                  if (!e.target.checked) { setRequested(true); return; }
                  setState((x) => ({ ...x, categories: { ...x.categories, [c]: true } }));
                }} />
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Categories can be added instantly. Removing one goes through a protection change request.</p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 text-lg font-semibold">Trusted person</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Status: {s.trustedPerson ? `${s.trustedPerson.name} · ${s.trustedPerson.status}` : "Not configured"}
          </p>
          {!s.trustedPerson ? (
            <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); if (!tp.name) return; setState((x) => ({ ...x, trustedPerson: { ...tp, status: "pending", share: { milestones: true, protectionChanges: true, checkIns: false } } })); }}>
              <input className="w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Name" value={tp.name} onChange={(e) => setTp({ ...tp, name: e.target.value })} />
              <input className="w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Phone (for one-tap call/text) or email" value={tp.contact} onChange={(e) => setTp({ ...tp, contact: e.target.value })} />
              <Button type="submit" variant="solid" size="sm">Invite</Button>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">What they can see — you choose</p>
              {([["milestones", "Milestones I reach"], ["protectionChanges", "When I ask to turn protection off"], ["checkIns", "Weekly check-in (\"doing okay\")"]] as const).map(([k, label]) => {
                const share = s.trustedPerson!.share ?? { milestones: true, protectionChanges: true, checkIns: false };
                return (
                  <label key={k} className="flex cursor-pointer items-center justify-between rounded-2xl bg-muted px-4 py-3 text-sm">{label}
                    <input type="checkbox" className="size-4 accent-[var(--accent)]" checked={share[k]} onChange={(e) => setState((x) => ({ ...x, trustedPerson: x.trustedPerson && { ...x.trustedPerson, share: { ...share, [k]: e.target.checked } } }))} />
                  </label>
                );
              })}
              <p className="text-xs text-muted-foreground">Never shared: your setback notes, debts, chats with the coach or anything you write privately.</p>
              <Button variant="ghost" size="sm" onClick={() => { if (confirm(`Remove ${s.trustedPerson!.name}'s access now?`)) setState((x) => ({ ...x, trustedPerson: undefined })); }}>Revoke access</Button>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold">Protection change</h2>
          <p className="mb-4 text-sm text-muted-foreground">Protection changes may require a cooldown and/or trusted-person approval depending on configuration.</p>
          {requested ? (
            <p className="rounded-2xl bg-muted p-4 text-sm">Request received. A 72-hour cooldown has started. Your protection stays fully on meanwhile.</p>
          ) : (
            <Button onClick={() => setRequested(true)}>Request protection change</Button>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Report a site</h2>
        <form className="grid gap-2 md:grid-cols-[1fr_200px]" onSubmit={(e) => {
          e.preventDefault(); if (!report.domain) return;
          setState((x) => ({ ...x, reports: [...x.reports, { ...report, date: new Date().toISOString() }] }));
          setReport({ domain: "", category: "Casinos", reason: "" });
        }}>
          <input className="rounded-2xl bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="example.com" value={report.domain} onChange={(e) => setReport({ ...report, domain: e.target.value })} />
          <select className="rounded-2xl bg-muted px-4 py-3 text-sm outline-none" value={report.category} onChange={(e) => setReport({ ...report, category: e.target.value })}>
            {BLOCK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input className="rounded-2xl bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring md:col-span-2" placeholder="Reason (optional)" value={report.reason} onChange={(e) => setReport({ ...report, reason: e.target.value })} />
          <Button type="submit" variant="solid" className="md:w-40">Submit</Button>
        </form>
        {s.reports.length > 0 && <p className="mt-3 text-xs text-muted-foreground">{s.reports.length} site(s) reported. Thank you.</p>}
      </Card>

      <BarrierGuide />

      <LaunchGuide />

      <DnsShield />

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Device setup</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DEVICES.map(({ icon: Icon, name, status }) => (
            <div key={name} className="rounded-2xl bg-muted p-4">
              <Icon className="mb-3 size-5 text-accent" />
              <p className="font-medium">{name}</p>
              <Eyebrow className="mt-1 normal-case tracking-normal">{status}</Eyebrow>
            </div>
          ))}
        </div>
        <Link to="/blocked" className={pill({ variant: "ghost", size: "sm" }) + " mt-4"}>Preview block screen</Link>
      </Card>
    </div>
  );
}
