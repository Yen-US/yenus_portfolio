"use client";

import { Calculator, PhoneCall, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { apiJson } from "@/lib/signal-room/client";
import { computeCostMath, formatUsd } from "@/lib/signal-room/cost-math";
import { OFFERS, suggestUpfront } from "@/lib/signal-room/offers";
import type {
  Account,
  CallRecord,
  CostMathQuestion,
  NinetyDayPlan,
  OfferName,
} from "@/lib/signal-room/types";
import { CALL_OUTCOMES, MUTUAL_FIT_VALUES } from "@/lib/signal-room/types";
import {
  CopyButton,
  Field,
  PanelHeading,
  StatusBadge,
  StudioButton,
  StudioInput,
  StudioSelect,
  StudioTextarea,
} from "@/components/signal-room/ui";

type CallTab = "prep" | "capture" | "proposal";

interface CallPrep {
  questions: CostMathQuestion[];
  openingFrame: string;
  disqualifySignals: string[];
}

export function CallPanel({
  accounts,
  mode,
  onAccountsChange,
}: {
  accounts: Account[];
  mode: "supabase" | "demo";
  onAccountsChange: (accounts: Account[]) => void;
}) {
  // Calls only make sense for accounts that have reached conversation stage.
  const eligible = accounts.filter(
    (account) => !["watchlist", "archived", "lost"].includes(account.status)
  );
  const [selectedId, setSelectedId] = useState(eligible[0]?.id ?? "");
  const selected = eligible.find((account) => account.id === selectedId) ?? eligible[0] ?? null;

  function upsertAccount(next: Account) {
    onAccountsChange(accounts.map((item) => (item.id === next.id ? next : item)));
  }

  return (
    <div>
      <PanelHeading eyebrow="Step 3" title="Calls" />

      {selected ? (
        <div className="mt-7">
          <Field label="Account">
            <StudioSelect
              value={selected.id}
              onChange={(event) => setSelectedId(event.target.value)}
              className="max-w-md"
            >
              {eligible.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} — {account.status}
                </option>
              ))}
            </StudioSelect>
          </Field>
          <CallWorkspace
            key={selected.id}
            account={selected}
            mode={mode}
            onChange={upsertAccount}
          />
        </div>
      ) : (
        <div className="mt-7 grid min-h-72 place-items-center border border-dashed border-border text-center">
          <div>
            <PhoneCall className="mx-auto h-6 w-6 text-signal" />
            <p className="mt-4 text-sm font-semibold">No account has reached a call yet</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Accounts appear here once they move past the watchlist.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CallWorkspace({
  account,
  mode,
  onChange,
}: {
  account: Account;
  mode: "supabase" | "demo";
  onChange: (account: Account) => void;
}) {
  const [tab, setTab] = useState<CallTab>("prep");
  const [prep, setPrep] = useState<CallPrep | null>(null);
  const [call, setCall] = useState<Partial<CallRecord>>(account.call ?? {});
  const [mutualFit, setMutualFit] = useState(account.mutualFit);
  const [plan, setPlan] = useState<NinetyDayPlan | null>(account.call?.plan ?? null);
  const [error, setError] = useState("");
  const [isPreparing, startPrep] = useTransition();
  const [isSaving, startSave] = useTransition();
  const [isPlanning, startPlan] = useTransition();

  const math = computeCostMath(call, { mutualFitJudged: mutualFit !== "unknown" });
  const moneyUnlocked = mutualFit !== "unknown";

  function set<K extends keyof CallRecord>(key: K, value: CallRecord[K]) {
    setCall((current) => ({ ...current, [key]: value }));
  }

  function generatePrep() {
    setError("");
    startPrep(async () => {
      try {
        const result = await apiJson<{ prep: CallPrep }>("/api/signal-room/calls", {
          method: "POST",
          body: JSON.stringify({
            action: "prep",
            account: {
              name: account.name,
              oneLiner: account.oneLiner,
              stage: account.stage,
              approxUsers: account.approxUsers,
            },
            brief: account.brief,
            observations: account.observations,
          }),
        });
        setPrep(result.prep);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Prep failed.");
      }
    });
  }

  function generatePlan() {
    if (!call.offer) return;
    setError("");
    startPlan(async () => {
      try {
        const result = await apiJson<{ plan: NinetyDayPlan }>("/api/signal-room/calls", {
          method: "POST",
          body: JSON.stringify({
            action: "plan",
            account: {
              name: account.name,
              oneLiner: account.oneLiner,
              stage: account.stage,
              approxUsers: account.approxUsers,
            },
            brief: account.brief,
            offerName: call.offer,
            call,
          }),
        });
        setPlan(result.plan);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Plan failed.");
      }
    });
  }

  function saveCall() {
    setError("");
    startSave(async () => {
      try {
        if (mode === "supabase") {
          const result = await apiJson<{ call: CallRecord }>("/api/signal-room/calls", {
            method: "POST",
            body: JSON.stringify({ accountId: account.id, ...call, plan }),
          });
          await apiJson("/api/signal-room/accounts", {
            method: "PATCH",
            body: JSON.stringify({ id: account.id, mutualFit }),
          });
          onChange({ ...account, call: result.call, mutualFit });
        } else {
          const now = new Date().toISOString();
          onChange({
            ...account,
            mutualFit,
            call: {
              id: account.call?.id ?? `demo-${crypto.randomUUID()}`,
              accountId: account.id,
              createdAt: account.call?.createdAt ?? now,
              heldAt: null,
              monthlySpendUsd: null,
              spendBasis: "",
              wastePct: null,
              wasteBasis: "",
              reclaimIntent: "",
              revenueNowUsd: null,
              revenueTargetUsd: null,
              costOfDelay: "",
              notes: "",
              offer: "",
              priceUsd: null,
              upfrontUsd: null,
              outcome: "held",
              ...call,
              plan,
              updatedAt: now,
            },
          });
        }
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Save failed.");
      }
    });
  }

  const selectedOffer = OFFERS.find((item) => item.name === call.offer);
  const proposalText = plan
    ? [
        `${account.name} — ${call.offer ?? "engagement"}`,
        "",
        ...plan.milestones.map(
          (milestone) => `Day ${milestone.day}: ${milestone.outcome}\n  Evidence: ${milestone.evidence}`
        ),
        "",
        call.priceUsd ? `Investment: ${formatUsd(call.priceUsd)}` : "",
        call.upfrontUsd ? `Upfront: ${formatUsd(call.upfrontUsd)}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-1 border-b border-border">
        {(
          [
            ["prep", "Prep", Sparkles],
            ["capture", "Capture", Calculator],
            ["proposal", "Proposal", PhoneCall],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`focus-ring inline-flex min-h-10 items-center gap-2 border-b-2 px-4 text-xs font-semibold ${
              tab === id
                ? "border-signal text-signal"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mt-5 border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {tab === "prep" ? (
        <div className="mt-6 space-y-6">
          <StudioButton onClick={generatePrep} loading={isPreparing}>
            <Sparkles className="h-4 w-4" />
            Build cost-math questions
          </StudioButton>

          {prep ? (
            <div className="grid gap-7 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <p className="consulting-kicker text-signal">Opening frame</p>
                <p className="mt-2 text-sm leading-6">{prep.openingFrame}</p>

                <h3 className="mt-6 text-sm font-semibold">
                  Questions that make them state a number
                </h3>
                <div className="mt-3 divide-y divide-border border-t border-foreground">
                  {prep.questions.map((question) => (
                    <div key={question.question} className="py-4">
                      <p className="text-sm leading-6">{question.question}</p>
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        Fills <span className="font-mono text-signal">{question.fills}</span> · anchored to{" "}
                        {question.anchoredTo}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="consulting-kicker text-brass">Disqualify if you hear</p>
                <ul className="mt-3 space-y-2">
                  {prep.disqualifySignals.map((signal) => (
                    <li key={signal} className="text-[11px] leading-5 text-muted-foreground">— {signal}</li>
                  ))}
                </ul>
                {account.brief ? (
                  <div className="mt-7 border-t border-border pt-5">
                    <p className="consulting-kicker text-muted-foreground">Account read</p>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">{account.brief.summary}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="border border-dashed border-border p-6 text-xs leading-5 text-muted-foreground">
              Generate questions that convert each architecture hypothesis into a number the
              prospect says out loud. The model produces questions, never figures.
            </p>
          )}
        </div>
      ) : null}

      {tab === "capture" ? (
        <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_0.85fr]">
          <div className="space-y-5">
            <Field
              label="Mutual fit"
              hint="Judge this first. If you would not want to work with them, the money questions do not matter."
            >
              <StudioSelect
                value={mutualFit}
                onChange={(event) => setMutualFit(event.target.value as Account["mutualFit"])}
              >
                {MUTUAL_FIT_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </StudioSelect>
            </Field>

            <fieldset disabled={!moneyUnlocked} className="space-y-5 disabled:opacity-50">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Monthly spend (USD)">
                  <StudioInput
                    type="number"
                    value={call.monthlySpendUsd ?? ""}
                    onChange={(event) =>
                      set("monthlySpendUsd", event.target.value === "" ? null : Number(event.target.value))
                    }
                  />
                </Field>
                <Field label="Avoidable share (%)">
                  <StudioInput
                    type="number"
                    min={0}
                    max={100}
                    value={call.wastePct ?? ""}
                    onChange={(event) =>
                      set("wastePct", event.target.value === "" ? null : Number(event.target.value))
                    }
                  />
                </Field>
              </div>
              <Field label="Where the spend figure came from" hint="Their words. This is what makes the number defensible.">
                <StudioInput
                  value={call.spendBasis ?? ""}
                  onChange={(event) => set("spendBasis", event.target.value)}
                />
              </Field>
              <Field label="Why you both believe that share">
                <StudioInput
                  value={call.wasteBasis ?? ""}
                  onChange={(event) => set("wasteBasis", event.target.value)}
                />
              </Field>
              <Field label="If they had it back, what would they do?">
                <StudioTextarea
                  value={call.reclaimIntent ?? ""}
                  onChange={(event) => set("reclaimIntent", event.target.value)}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Revenue now (USD)">
                  <StudioInput
                    type="number"
                    value={call.revenueNowUsd ?? ""}
                    onChange={(event) =>
                      set("revenueNowUsd", event.target.value === "" ? null : Number(event.target.value))
                    }
                  />
                </Field>
                <Field label="Revenue target (USD)">
                  <StudioInput
                    type="number"
                    value={call.revenueTargetUsd ?? ""}
                    onChange={(event) =>
                      set("revenueTargetUsd", event.target.value === "" ? null : Number(event.target.value))
                    }
                  />
                </Field>
              </div>
              <Field label="How long will they leave it?" hint="Their answer, verbatim. This is the urgency.">
                <StudioTextarea
                  value={call.costOfDelay ?? ""}
                  onChange={(event) => set("costOfDelay", event.target.value)}
                />
              </Field>
              <Field label="Call notes">
                <StudioTextarea
                  value={call.notes ?? ""}
                  onChange={(event) => set("notes", event.target.value)}
                  className="min-h-32"
                />
              </Field>
            </fieldset>

            <StudioButton onClick={saveCall} loading={isSaving}>
              Save call
            </StudioButton>
          </div>

          <div>
            <div className="border border-border bg-card p-5">
              <p className="consulting-kicker text-signal">Cost math</p>
              <div className="mt-4 divide-y divide-border">
                {math.figures.map((figure) => (
                  <div key={figure.label} className="py-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-xs">{figure.label}</p>
                      <p className="consulting-display text-lg">{figure.display}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge
                        tone={
                          figure.confidence === "stated"
                            ? "good"
                            : figure.confidence === "estimated"
                              ? "warn"
                              : "neutral"
                        }
                      >
                        {figure.confidence}
                      </StatusBadge>
                      <p className="text-[11px] leading-5 text-muted-foreground">{figure.basis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {math.missing.length > 0 ? (
              <div className="mt-5 border border-brass/30 bg-brass/5 p-5">
                <p className="text-xs font-semibold text-brass">Before you quote a price</p>
                <ul className="mt-2 space-y-1">
                  {math.missing.map((item) => (
                    <li key={item} className="text-[11px] leading-5 text-muted-foreground">— {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "proposal" ? (
        <div className="mt-6 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <Field label="Engagement">
              <StudioSelect
                value={call.offer ?? ""}
                onChange={(event) => set("offer", event.target.value as OfferName)}
              >
                <option value="">Select an engagement</option>
                {OFFERS.map((offer) => (
                  <option key={offer.name} value={offer.name}>
                    {offer.name} ({offer.durationLabel})
                  </option>
                ))}
              </StudioSelect>
            </Field>

            {selectedOffer ? (
              <p className="border-l-2 border-signal pl-3 text-[11px] leading-5 text-muted-foreground">
                Internal planning band: {formatUsd(selectedOffer.priceBand.low)} –{" "}
                {formatUsd(selectedOffer.priceBand.high)}. You set the number, not the model.
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price (USD)">
                <StudioInput
                  type="number"
                  value={call.priceUsd ?? ""}
                  onChange={(event) => {
                    const price = event.target.value === "" ? null : Number(event.target.value);
                    set("priceUsd", price);
                    if (price !== null && call.offer && !call.upfrontUsd) {
                      set("upfrontUsd", suggestUpfront(call.offer, price));
                    }
                  }}
                />
              </Field>
              <Field label="Upfront (USD)">
                <StudioInput
                  type="number"
                  value={call.upfrontUsd ?? ""}
                  onChange={(event) =>
                    set("upfrontUsd", event.target.value === "" ? null : Number(event.target.value))
                  }
                />
              </Field>
            </div>

            <Field label="Outcome">
              <StudioSelect
                value={call.outcome ?? "held"}
                onChange={(event) => set("outcome", event.target.value as CallRecord["outcome"])}
              >
                {CALL_OUTCOMES.map((outcome) => (
                  <option key={outcome} value={outcome}>
                    {outcome.replace(/_/g, " ")}
                  </option>
                ))}
              </StudioSelect>
            </Field>

            <div className="flex flex-wrap gap-3">
              <StudioButton onClick={generatePlan} loading={isPlanning} disabled={!call.offer}>
                <Sparkles className="h-4 w-4" />
                Draft 90-day plan
              </StudioButton>
              <StudioButton variant="secondary" onClick={saveCall} loading={isSaving}>
                Save
              </StudioButton>
            </div>
          </div>

          <div>
            {plan ? (
              <div className="border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="consulting-kicker text-signal">90-day plan</p>
                  <CopyButton text={proposalText} label="Copy proposal" />
                </div>
                <div className="mt-4 divide-y divide-border">
                  {plan.milestones.map((milestone) => (
                    <div key={`${milestone.day}-${milestone.outcome}`} className="py-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-signal">
                        Day {milestone.day}
                      </p>
                      <p className="mt-2 text-sm leading-6">{milestone.outcome}</p>
                      <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                        Evidence: {milestone.evidence}
                      </p>
                    </div>
                  ))}
                </div>
                {plan.assumptions.length > 0 ? (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="consulting-kicker text-muted-foreground">Assumptions</p>
                    {plan.assumptions.map((item) => (
                      <p key={item} className="mt-1 text-[11px] leading-5 text-muted-foreground">— {item}</p>
                    ))}
                  </div>
                ) : null}
                {plan.outOfScope.length > 0 ? (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="consulting-kicker text-muted-foreground">Out of scope</p>
                    {plan.outOfScope.map((item) => (
                      <p key={item} className="mt-1 text-[11px] leading-5 text-muted-foreground">— {item}</p>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="border border-dashed border-border p-6 text-xs leading-5 text-muted-foreground">
                Pick an engagement and draft a plan. Every milestone states an outcome and the
                evidence proving it — never an activity.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
