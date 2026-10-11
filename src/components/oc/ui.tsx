import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const pill = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        solid: "bg-primary text-primary-foreground hover:opacity-90",
        glass: "glass text-foreground hover:bg-secondary",
        accent: "bg-gradient-accent text-accent-foreground shadow-glow hover:brightness-105",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary",
        danger: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: { sm: "h-9 px-4 text-sm", md: "h-11 px-5 text-sm", lg: "h-14 px-7 text-base" },
    },
    defaultVariants: { variant: "glass", size: "md" },
  },
);

export function Button({
  className, variant, size, ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof pill>) {
  return <button className={cn(pill({ variant, size }), className)} {...p} />;
}

export function Card({ className, ...p }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-3xl p-6", className)} {...p} />;
}

export function Chip({ active, className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "h-10 shrink-0 rounded-full px-4 text-sm font-medium transition-all",
        active ? "bg-primary text-primary-foreground" : "glass text-foreground hover:bg-secondary",
        className,
      )}
      {...p}
    />
  );
}

export function Eyebrow({ className, ...p }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground", className)} {...p} />;
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div className="h-full rounded-full bg-gradient-accent transition-all duration-700" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function DemoNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-glass-border px-4 py-3 text-xs text-muted-foreground">
      <span className="font-semibold text-warning">Demo · </span>{children}
    </p>
  );
}

export function PageHeader({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <header className="mb-8 fade-up">
      {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
      <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
      {sub && <p className="mt-2 max-w-xl text-muted-foreground">{sub}</p>}
    </header>
  );
}
