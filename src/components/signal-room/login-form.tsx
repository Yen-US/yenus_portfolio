"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { StudioButton, StudioInput } from "@/components/signal-room/ui";

/**
 * Passphrase form for the Signal Room.
 *
 * Wrapped in Suspense because useSearchParams opts the page into client-side
 * rendering; without a boundary the whole route bails out of prerendering.
 */
export function LoginForm() {
  return (
    <Suspense fallback={<FormShell disabled />}>
      <LoginFormInner />
    </Suspense>
  );
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/signal-room/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          setError(data?.error ?? "Sign in failed.");
          return;
        }
        // Only accept an internal path, so a crafted ?from= cannot bounce the
        // browser to another origin after a successful sign-in.
        const from = searchParams.get("from");
        const target = from && from.startsWith("/signal-room") ? from : "/signal-room";
        router.replace(target);
        router.refresh();
      } catch {
        setError("Sign in failed.");
      }
    });
  }

  return (
    <FormShell
      onSubmit={submit}
      value={password}
      onValueChange={setPassword}
      error={error}
      loading={isPending}
    />
  );
}

function FormShell({
  onSubmit,
  value = "",
  onValueChange,
  error = "",
  loading = false,
  disabled = false,
}: {
  onSubmit?: (event: React.FormEvent) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-8 border border-border bg-card p-6">
      <label htmlFor="signal-password" className="text-sm font-semibold">
        Passphrase
      </label>
      <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
        This workspace stores prospect financials. Sessions last 14 days.
      </p>
      <StudioInput
        id="signal-password"
        type="password"
        autoComplete="current-password"
        autoFocus
        required
        disabled={disabled}
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        className="mt-4 w-full"
      />
      {error ? (
        <p className="mt-3 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <StudioButton type="submit" loading={loading} disabled={disabled} className="mt-5 w-full">
        Sign in
      </StudioButton>
    </form>
  );
}
