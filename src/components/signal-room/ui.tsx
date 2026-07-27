"use client";

import { Check, Copy, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StudioButton({
  children,
  variant = "primary",
  loading = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  loading?: boolean;
}) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-sm px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-signal text-white hover:bg-foreground",
        variant === "secondary" && "border border-border bg-background hover:border-foreground",
        variant === "quiet" && "px-2 text-muted-foreground hover:bg-secondary hover:text-foreground",
        variant === "danger" && "border border-destructive/40 text-destructive hover:bg-destructive/5",
        className
      )}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function StudioInput({ className, ...props }: React.ComponentProps<"input">) {
  return <input {...props} className={cn("discovery-input", className)} />;
}

export function StudioSelect({ className, ...props }: React.ComponentProps<"select">) {
  return <select {...props} className={cn("discovery-input", className)} />;
}

export function StudioTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={cn("discovery-input min-h-28 resize-y py-3", className)}
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold">{label}</span>
      {hint ? <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

export function PanelHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="consulting-kicker text-signal">{eyebrow}</p>
        <h1 className="consulting-display mt-2 text-3xl leading-tight md:text-4xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em]",
        tone === "neutral" && "border-border bg-background text-muted-foreground",
        tone === "good" && "border-signal/30 bg-signal/5 text-signal",
        tone === "warn" && "border-brass/30 bg-brass/5 text-brass"
      )}
    >
      {children}
    </span>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <StudioButton
      type="button"
      variant="quiet"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      aria-label={`${label}: ${copied ? "copied" : "copy to clipboard"}`}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </StudioButton>
  );
}