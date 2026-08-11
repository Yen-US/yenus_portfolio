"use client";

import { Crosshair, Lock, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { apiJson } from "@/lib/signal-room/client";
import type { Account, IcpProfile, StartupStage } from "@/lib/signal-room/types";
import { findIcpDrift } from "@/lib/signal-room/fit-score";
import {
  Field,
  PanelHeading,
  StatusBadge,
  StudioButton,
  StudioInput,
  StudioTextarea,
} from "@/components/signal-room/ui";

interface IcpDraft {
  label: string;
  statement: string;
  stages: StartupStage[];
  regions: string[];
  buyerRoles: string[];
  disqualifiers: string[];
  keywordBanks: IcpProfile["keywordBanks"];
  measurableWeakness: string;
  ambiguities: string[];
}

export function IcpPanel({
  icp,
  accounts,
  mode,
  onIcpChange,
}: {
  icp: IcpProfile | null;
  accounts: Account[];
  mode: "supabase" | "demo";
  onIcpChange: (icp: IcpProfile) => void;
}) {
  const [statement, setStatement] = useState(icp?.statement ?? "");
  const [draft, setDraft] = useState<IcpDraft | null>(null);
  const [error, setError] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isSharpening, startSharpen] = useTransition();
  const [isSaving, startSave] = useTransition();

  const drift = findIcpDrift(accounts, icp);

  function sharpen() {
    setError("");
    startSharpen(async () => {
      try {
        const result = await apiJson<{ draft: IcpDraft }>("/api/signal-room/icp", {
          method: "POST",
          body: JSON.stringify({ action: "sharpen", statement }),
        });
        setDraft(result.draft);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Sharpen failed.");
      }
    });
  }

  function lockDraft() {
    if (!draft) return;
    setError("");
    startSave(async () => {
      try {
        const created = await apiJson<{ profile: IcpProfile }>("/api/signal-room/icp", {
          method: "POST",
          body: JSON.stringify(draft),
        });
        const locked = await apiJson<{ profile: IcpProfile }>("/api/signal-room/icp", {
          method: "PATCH",
          body: JSON.stringify({ id: created.profile.id }),
        });
        onIcpChange(locked.profile);
        setDraft(null);
        setConfirmText("");
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Lock failed.");
      }
    });
  }

  const nextVersion = (icp?.version ?? 0) + 1;
  const confirmPhrase = `lock v${nextVersion}`;

  return (
    <div>
      <PanelHeading
        eyebrow="Targeting"
        title="Ideal customer profile"
        action={
          icp ? (
            <StatusBadge tone="good">Locked v{icp.version}</StatusBadge>
          ) : (
            <StatusBadge tone="warn">No ICP locked</StatusBadge>
          )
        }
      />

      {mode === "demo" ? (
        <p className="mt-5 border-l-2 border-brass bg-brass/5 px-4 py-3 text-xs leading-5 text-brass">
          Demo mode shows the seed ICP. Locking requires Supabase.
        </p>
      ) : null}

      {error ? (
        <p className="mt-5 border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-7 grid gap-8 xl:grid-cols-[1fr_0.85fr]">
        <div className="space-y-6">
          {icp ? (
            <div className="border border-border bg-card p-5">
              <p className="consulting-kicker text-signal">Active definition</p>
              <p className="mt-3 text-sm leading-7">{icp.statement}</p>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <Detail label="Stages" value={icp.stages.join(", ")} />
                <Detail label="Regions" value={icp.regions.join(", ") || "Not set"} />
                <Detail label="Buyer roles" value={icp.buyerRoles.join(", ") || "Not set"} />
                <Detail
                  label="Locked"
                  value={icp.lockedAt ? new Date(icp.lockedAt).toLocaleDateString() : "Draft"}
                />
              </dl>
              {icp.measurableWeakness ? (
                <div className="mt-5 border-t border-border pt-4">
                  <p className="consulting-kicker text-muted-foreground">Weakness to measure yourself</p>
                  <p className="mt-2 text-sm leading-6">{icp.measurableWeakness}</p>
                </div>
              ) : null}
              {icp.disqualifiers.length > 0 ? (
                <div className="mt-5 border-t border-border pt-4">
                  <p className="consulting-kicker text-muted-foreground">Disqualifiers</p>
                  <ul className="mt-2 space-y-1">
                    {icp.disqualifiers.map((item) => (
                      <li key={item} className="text-xs leading-5 text-muted-foreground">— {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          <Field
            label="Targeting statement"
            hint="Write it loosely. Sharpening narrows it; narrowing is the goal."
          >
            <StudioTextarea
              value={statement}
              onChange={(event) => setStatement(event.target.value)}
              className="min-h-32"
              placeholder="Seed to Series B B2B AI startups where latency in the core workflow is visible to a prospective user..."
            />
          </Field>
          <StudioButton onClick={sharpen} loading={isSharpening} disabled={statement.trim().length < 10}>
            <Sparkles className="h-4 w-4" />
            Sharpen definition
          </StudioButton>
        </div>

        <div>
          {draft ? (
            <div className="border border-signal/30 bg-signal/5 p-5">
              <p className="consulting-kicker text-signal">Proposed v{nextVersion}</p>
              <p className="mt-2 text-sm font-semibold">{draft.label}</p>
              <p className="mt-3 text-sm leading-6">{draft.statement}</p>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <Detail label="Stages" value={draft.stages.join(", ")} />
                <Detail label="Regions" value={draft.regions.join(", ")} />
                <Detail label="Buyer roles" value={draft.buyerRoles.join(", ")} />
              </dl>

              <div className="mt-5 border-t border-signal/20 pt-4">
                <p className="consulting-kicker text-muted-foreground">Weakness to measure</p>
                <p className="mt-2 text-sm leading-6">{draft.measurableWeakness}</p>
              </div>

              {draft.ambiguities.length > 0 ? (
                <div className="mt-5 border border-brass/30 bg-brass/5 p-4">
                  <p className="text-xs font-semibold text-brass">Still ambiguous</p>
                  <ul className="mt-2 space-y-1">
                    {draft.ambiguities.map((item) => (
                      <li key={item} className="text-[11px] leading-5 text-muted-foreground">— {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 border-t border-signal/20 pt-5">
                <p className="text-xs leading-5 text-muted-foreground">
                  Locking v{nextVersion} means accounts sourced under
                  {icp ? ` v${icp.version}` : " no ICP"} are no longer score-comparable.
                  Type <span className="font-mono text-foreground">{confirmPhrase}</span> to confirm.
                </p>
                <StudioInput
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                  className="mt-3"
                  aria-label="Confirmation phrase"
                  placeholder={confirmPhrase}
                />
                <StudioButton
                  onClick={lockDraft}
                  loading={isSaving}
                  disabled={confirmText.trim().toLowerCase() !== confirmPhrase || mode === "demo"}
                  className="mt-3"
                >
                  <Lock className="h-4 w-4" />
                  Lock v{nextVersion}
                </StudioButton>
              </div>
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center border border-dashed border-border p-6 text-center">
              <div>
                <Crosshair className="mx-auto h-6 w-6 text-signal" />
                <p className="mt-4 text-sm font-semibold">No draft yet</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Sharpen a statement to review a proposed profile before locking it.
                </p>
              </div>
            </div>
          )}

          {drift.length > 0 ? (
            <div className="mt-6 border border-brass/30 bg-brass/5 p-5">
              <p className="text-xs font-semibold text-brass">
                {drift.length} account{drift.length === 1 ? "" : "s"} drift from the locked ICP
              </p>
              <div className="mt-3 space-y-2">
                {drift.slice(0, 8).map(({ account, reason }) => (
                  <p key={account.id} className="text-[11px] leading-5 text-muted-foreground">
                    <span className="font-semibold text-foreground">{account.name}</span> — {reason}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="consulting-kicker text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-xs leading-5">{value}</dd>
    </div>
  );
}
