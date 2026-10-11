import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BIPEvent = Event & { prompt: () => Promise<void> };

export function InstallHint() {
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);
  const [evt, setEvt] = useState<BIPEvent | null>(null);

  useEffect(() => {
    const standalone = matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;
    const mobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
    if (standalone || !mobile || localStorage.getItem("oc-install-dismissed")) return;
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    setShow(true);
    const h = (e: Event) => { e.preventDefault(); setEvt(e as BIPEvent); };
    addEventListener("beforeinstallprompt", h);
    return () => removeEventListener("beforeinstallprompt", h);
  }, []);

  if (!show) return null;
  const close = () => { localStorage.setItem("oc-install-dismissed", "1"); setShow(false); };

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-sm">
        <Download className="size-4 shrink-0 text-primary" />
        <p className="flex-1 text-muted-foreground">
          {ios ? <>Install One Chance: tap <b className="text-foreground">Share</b> then <b className="text-foreground">Add to Home Screen</b>.</>
            : evt ? "Install One Chance on your phone for a full-screen app."
            : <>Install: open the browser menu then <b className="text-foreground">Add to Home screen</b>.</>}
        </p>
        {evt && <button onClick={() => evt.prompt().then(close)} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Install</button>}
        <button onClick={close} aria-label="Dismiss"><X className="size-4 text-muted-foreground" /></button>
      </div>
    </div>
  );
}
