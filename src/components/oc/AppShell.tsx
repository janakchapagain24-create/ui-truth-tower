import { Link, Outlet } from "@tanstack/react-router";
import { Home, Shield, Target, Hammer, Briefcase, MessageCircle, Users, TrendingUp, Siren, Gamepad2 } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { to: "/app", label: "Home", icon: Home },
  { to: "/app/protect", label: "Protect", icon: Shield },
  { to: "/app/missions", label: "Missions", icon: Target },
  { to: "/app/rebuild", label: "Rebuild", icon: Hammer },
  { to: "/app/community", label: "Community", icon: Users },
  { to: "/app/work", label: "Work", icon: Briefcase },
  { to: "/app/coach", label: "AI Coach", icon: MessageCircle },
  { to: "/app/games", label: "Games", icon: Gamepad2 },
  { to: "/app/progress", label: "Progress", icon: TrendingUp },
] as const;

const MOBILE = ["/app", "/app/missions", "/app/games", "/app/community", "/app/coach"];

export function AppShell() {
  return (
    <div className="min-h-screen md:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/60 p-5 backdrop-blur-xl md:flex">
        <div className="mb-8 flex items-center justify-between px-2"><Link to="/"><Logo /></Link><ThemeToggle /></div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/app" }}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground">
              <Icon className="size-4" /> {label}
            </Link>
          ))}
        </nav>
        <Link to="/app/emergency"
          className="flex items-center justify-center gap-2 rounded-full bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground transition hover:opacity-90">
          <Siren className="size-4" /> I'm about to gamble
        </Link>
      </aside>

      <main className="flex-1 px-5 pb-36 pt-6 md:px-10 md:pb-16 md:pt-10">
        <div className="mb-6 flex items-center justify-between md:hidden">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="mx-auto max-w-5xl"><Outlet /></div>
      </main>

      <Link to="/app/emergency"
        className="fixed inset-x-5 bottom-24 z-40 flex items-center justify-center gap-2 rounded-full bg-destructive py-3.5 text-sm font-semibold text-destructive-foreground shadow-lg md:hidden">
        <Siren className="size-4" /> I'm about to gamble
      </Link>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-sidebar-border bg-sidebar/80 px-2 pb-5 pt-2 backdrop-blur-xl md:hidden">
        {NAV.filter((n) => MOBILE.includes(n.to)).map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: to === "/app" }}
            className="flex flex-col items-center gap-1 px-3 py-1 text-[11px] text-muted-foreground data-[status=active]:text-foreground">
            <Icon className="size-5" /> {label === "AI Coach" ? "AI" : label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
