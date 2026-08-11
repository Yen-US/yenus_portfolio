"use client";

import { FlaskConical, Plus, Trash2 } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";
import { apiJson } from "@/lib/signal-room/client";
import type { Account, HandsOnObservation, TestPlan } from "@/lib/signal-room/types";
import {
  Field,
  StatusBadge,
  StudioButton,
  StudioInput,
  StudioSelect,
  StudioTextarea,
} from "@/components/signal-room/ui";

/**
 * The field test tab. This is the keystone of the whole methodology: the
 * opening message is only credible because it contains a number the operator
 * measured personally. Everything here is manual entry by design - automating
 * signup or scripted product use would violate the operating boundaries and
 * produce numbers that cannot be defended on a call.
 */
export function FieldTestView({
  account,
  mode,
  onChange,
}: {
  account: Account;
  mode: "supabase" | "demo";
  onChange: (account: Account) => void;
}) {
  const [testPlan, setTestPlan] = useState<TestPlan | null>(null);
  const [approxUsers, setApproxUsers] = useState(account.approxUsers);
  const [error, setError] = useState("");
  const [isPlanning, startPlanning] = useTransition();
  const [isSaving, startSave] = useTransition();

  const weaknesses = account.observations.filter((item) => item.isWeakness);

  function generatePlan() {
    setError("");
    startPlanning(async () => {
      try {
        const result = await apiJson<{ testPlan: TestPlan }>("/api/signal-room/test-plan", {
          method: "POST",
          body: JSON.stringify({
            account: {
              name: account.name,
              website: account.website,
              stage: account.stage,
              oneLiner: account.oneLiner,
            },
            brief: account.brief,
          }),
        });
        setTestPlan(result.testPlan);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Test plan failed.");
      }
    });
  }

  function addObservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const rawValue = String(data.get("value") ?? "").trim();

    const observation = {
      accountId: account.id,
      flow: String(data.get("flow") ?? ""),
      metric: String(data.get("metric") ?? ""),
      value: rawValue === "" ? null : Number(rawValue),
      unit: String(data.get("unit") ?? ""),
      tier: String(data.get("tier") ?? "free"),
      costUsd: Number(data.get("costUsd") ?? 0),
      rawNote: String(data.get("rawNote") ?? ""),
      isWeakness: data.get("isWeakness") === "on",
      observedAt: new Date().toISOString(),
    };

    setError("");
    startSave(async () => {
      try {
        let saved: HandsOnObservation;
        if (mode === "supabase") {
          const result = await apiJson<{ observation: HandsOnObservation }>(
            "/api/signal-room/observations",
            { method: "POST", body: JSON.stringify(observation) }
          );
          saved = result.observation;
        } else {
          saved = { ...observation, id: `demo-${crypto.randomUUID()}` };
        }
        onChange({ ...account, observations: [saved, ...account.observations] });
        form.reset();
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Save failed.");
      }
    });
  }

  function removeObservation(id: string) {
    startSave(async () => {
      try {
        if (mode === "supabase") {
          await apiJson("/api/signal-room/observations", {
            method: "DELETE",
            body: JSON.stringify({ id }),
          });
        }
        onChange({
          ...account,
          observations: account.observations.filter((item) => item.id !== id),
        });
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Delete failed.");
      }
    });
  }

  function saveApproxUsers() {
    startSave(async () => {
      try {
        if (mode === "supabase") {
          await apiJson("/api/signal-room/accounts", {
            method: "PATCH",
            body: JSON.stringify({ id: account.id, approxUsers }),
          });
        }
        onChange({ ...account, approxUsers });
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Save failed.");
      }
    });
  }

  return (
    <div className="mt-7 space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge tone={account.observations.length > 0 ? "good" : "warn"}>
          {account.observations.length > 0
            ? `${account.observations.length} observation${account.observations.length === 1 ? "" : "s"}`
            : "No field test yet"}
        </StatusBadge>
        {weaknesses.length > 0 ? (
          <StatusBadge tone="warn">{weaknesses.length} flagged as weakness</StatusBadge>
        ) : null}
      </div>

      {error ? (
        <p className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold">What to test</h3>
              <StudioButton variant="secondary" onClick={generatePlan} loading={isPlanning}>
                <FlaskConical className="h-4 w-4" />
                Plan the test
              </StudioButton>
            </div>
            {testPlan ? (
              <div className="mt-4 space-y-4">
                <div className="border border-border bg-card p-4">
                  <p className="consulting-kicker text-muted-foreground">Sign up</p>
                  <p className="mt-2 text-xs leading-5">{testPlan.signupPath}</p>
                  <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{testPlan.tierNote}</p>
                </div>
                {testPlan.tests.map((test, index) => (
                  <div key={test.whatToDo} className="border-t border-border pt-4">
                    <p className="text-xs font-semibold">
                      <span className="mr-2 font-mono text-[9px] text-signal">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {test.whatToDo}
                    </p>
                    <p className="mt-2 text-[11px] leading-5">
                      <span className="text-signal">Measure:</span> {test.whatToMeasure}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                      {test.whyItMatters} Expected: {test.expectedRange}
                    </p>
                  </div>
                ))}
                {testPlan.doNotDo.length > 0 ? (
                  <div className="border border-destructive/30 bg-destructive/5 p-4">
                    <p className="text-xs font-semibold text-destructive">Do not do</p>
                    <ul className="mt-2 space-y-1">
                      {testPlan.doNotDo.map((item) => (
                        <li key={item} className="text-[11px] leading-5 text-muted-foreground">— {item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 border border-dashed border-border p-5 text-xs leading-5 text-muted-foreground">
                Generate a plan of what to try on their free tier and which single number to
                measure. Then go and actually run it — the plan does not run itself.
              </p>
            )}
          </div>

          <div className="border-t border-border pt-5">
            <Field
              label="Approximate users"
              hint="Only what they stated publicly. Mark it unverified if you are estimating."
            >
              <StudioInput
                value={approxUsers}
                onChange={(event) => setApproxUsers(event.target.value)}
                placeholder="~1,200 per their launch post (unverified)"
              />
            </Field>
            <StudioButton variant="secondary" onClick={saveApproxUsers} loading={isSaving} className="mt-3">
              Save
            </StudioButton>
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={addObservation} className="border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Log what you measured</h3>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
              One row per thing you ran yourself. These numbers are the only ones the opener
              is allowed to use.
            </p>
            <div className="mt-5 grid gap-4">
              <Field label="What you did">
                <StudioInput name="flow" required placeholder="Signed up free tier, ran script analysis on a 30s video" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Metric">
                  <StudioInput name="metric" required placeholder="time to result" />
                </Field>
                <Field label="Value">
                  <StudioInput name="value" type="number" step="any" placeholder="252" />
                </Field>
                <Field label="Unit">
                  <StudioInput name="unit" placeholder="seconds" />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tier used">
                  <StudioSelect name="tier" defaultValue="free">
                    <option value="free">free</option>
                    <option value="trial">trial</option>
                    <option value="paid">paid</option>
                    <option value="demo-call">demo-call</option>
                  </StudioSelect>
                </Field>
                <Field label="Cost (USD)">
                  <StudioInput name="costUsd" type="number" step="any" defaultValue={0} min={0} />
                </Field>
              </div>
              <Field label="What actually happened">
                <StudioTextarea name="rawNote" className="min-h-24" placeholder="Second run was slower than the first, which suggests no warm cache." />
              </Field>
              <label className="flex items-center gap-3 text-xs">
                <input type="checkbox" name="isWeakness" className="h-4 w-4" />
                This is the weakness worth naming in the message
              </label>
              <StudioButton type="submit" loading={isSaving}>
                <Plus className="h-4 w-4" />
                Log observation
              </StudioButton>
            </div>
          </form>

          <div>
            <h3 className="text-sm font-semibold">Recorded observations</h3>
            <div className="mt-3 divide-y divide-border border-t border-foreground">
              {account.observations.map((observation) => (
                <div key={observation.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold">{observation.flow}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {observation.metric}: {observation.value ?? "—"} {observation.unit} ·{" "}
                      {observation.tier} · ${observation.costUsd}
                    </p>
                    {observation.rawNote ? (
                      <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{observation.rawNote}</p>
                    ) : null}
                    {observation.isWeakness ? (
                      <span className="mt-2 inline-block">
                        <StatusBadge tone="warn">weakness</StatusBadge>
                      </span>
                    ) : null}
                  </div>
                  <StudioButton
                    variant="quiet"
                    onClick={() => removeObservation(observation.id)}
                    aria-label={`Delete observation: ${observation.flow}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </StudioButton>
                </div>
              ))}
              {account.observations.length === 0 ? (
                <p className="py-8 text-xs leading-5 text-muted-foreground">
                  Nothing logged yet. Until one observation exists, the correction opener stays
                  locked — that is deliberate.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
