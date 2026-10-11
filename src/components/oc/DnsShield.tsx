import { useState } from "react";
import { Download } from "lucide-react";
import { Card, Button, Eyebrow } from "./ui";

const STARTER_BLOCKLIST = [
  "bet365.com", "williamhill.com", "paddypower.com", "betfair.com", "ladbrokes.com", "coral.co.uk", "skybet.com",
  "draftkings.com", "fanduel.com", "betmgm.com", "caesars.com", "pokerstars.com", "888.com", "888casino.com",
  "unibet.com", "bwin.com", "betway.com", "stake.com", "roobet.com", "bovada.lv", "1xbet.com", "betano.com",
  "pinnacle.com", "betvictor.com", "leovegas.com", "casumo.com", "mrgreen.com", "partypoker.com", "ggpoker.com", "rollbit.com",
];

function download(name: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  a.click(); URL.revokeObjectURL(url);
}

function uuid() { return crypto.randomUUID().toUpperCase(); }

export function mobileconfig(nextDnsId: string) {
  const id = nextDnsId.trim();
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>PayloadContent</key><array><dict>
<key>DNSSettings</key><dict><key>DNSProtocol</key><string>HTTPS</string><key>ServerURL</key><string>https://apple.dns.nextdns.io/${id}</string></dict>
<key>PayloadDisplayName</key><string>One Chance Shield</string>
<key>PayloadIdentifier</key><string>app.onechance.dns.${id}</string>
<key>PayloadType</key><string>com.apple.dnsSettings.managed</string>
<key>PayloadUUID</key><string>${uuid()}</string><key>PayloadVersion</key><integer>1</integer>
</dict></array>
<key>PayloadDisplayName</key><string>One Chance Shield (gambling block)</string>
<key>PayloadIdentifier</key><string>app.onechance.profile.${id}</string>
<key>PayloadRemovalDisallowed</key><false/>
<key>PayloadType</key><string>Configuration</string>
<key>PayloadUUID</key><string>${uuid()}</string><key>PayloadVersion</key><integer>1</integer>
</dict></plist>`;
}

export function hostsFile(domains = STARTER_BLOCKLIST) {
  return "# One Chance gambling blocklist\n" + domains.flatMap((d) => [`0.0.0.0 ${d}`, `0.0.0.0 www.${d}`]).join("\n") + "\n";
}

export function DnsShield() {
  const [id, setId] = useState("");
  const valid = /^[a-z0-9]{6}$/i.test(id.trim());
  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Real blocking on your devices</h2>
        <p className="mt-1 text-sm text-muted-foreground">Works today, no app needed. It blocks gambling sites across every browser and app on the device.</p>
      </div>

      <div className="rounded-2xl bg-muted p-4 text-sm">
        <Eyebrow className="mb-2">Step 1 · Free filter</Eyebrow>
        <ol className="ml-4 list-decimal space-y-1">
          <li>Create a free account at <a className="underline" href="https://my.nextdns.io/signup" target="_blank" rel="noreferrer">nextdns.io</a>.</li>
          <li>Open <b>Parental Control → Categories</b> and turn on <b>Gambling</b>.</li>
          <li>Copy your 6-character ID from the Setup tab.</li>
        </ol>
        <input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. a1b2c3"
          className="mt-3 w-full rounded-2xl bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-muted p-4 text-sm">
          <Eyebrow className="mb-2">iPhone · iPad · Mac</Eyebrow>
          <p className="mb-3 text-muted-foreground">Download, then open Settings → Profile Downloaded → Install.</p>
          <Button variant="solid" size="sm" disabled={!valid} onClick={() => download("one-chance-shield.mobileconfig", mobileconfig(id), "application/x-apple-aspen-config")}>
            <Download className="size-4" /> Get profile
          </Button>
        </div>
        <div className="rounded-2xl bg-muted p-4 text-sm">
          <Eyebrow className="mb-2">Android</Eyebrow>
          <p className="text-muted-foreground">Settings → Network → Private DNS → Hostname:</p>
          <code className="mt-2 block break-all rounded-xl bg-background px-3 py-2 text-xs">{valid ? `${id.trim()}.dns.nextdns.io` : "your-id.dns.nextdns.io"}</code>
        </div>
        <div className="rounded-2xl bg-muted p-4 text-sm sm:col-span-2">
          <Eyebrow className="mb-2">Windows · Mac · Linux (no account)</Eyebrow>
          <p className="mb-3 text-muted-foreground">Add these lines to your hosts file to block {STARTER_BLOCKLIST.length} major betting sites.</p>
          <Button variant="ghost" size="sm" onClick={() => download("one-chance-hosts.txt", hostsFile(), "text/plain")}>
            <Download className="size-4" /> Download blocklist
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Ask your trusted person to keep the NextDNS password. That makes switching it off a shared decision.</p>
    </Card>
  );
}
