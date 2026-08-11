"use client";

import { ExternalLink, Plus, Radar, Search, X } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";
import { apiJson, getAccountIdentityKey } from "@/lib/signal-room/client";
import { ICP_PRESETS } from "@/lib/signal-room/icp-presets";
import type { DiscoveredCompany, IcpProfile } from "@/lib/signal-room/types";
import {
  Field,
  PanelHeading,
  StatusBadge,
  StudioButton,
  StudioInput,
} from "@/components/signal-room/ui";

export function DiscoverPanel({
  icp,
  savedAccountKeys,
  onSave,
}: {
  icp: IcpProfile | null;
  savedAccountKeys: Set<string>;
  onSave: (company: DiscoveredCompany) => Promise<void>;
}) {
  const [presetId, setPresetId] = useState(ICP_PRESETS[0].id);
  const [angles, setAngles] = useState<string[]>(ICP_PRESETS[0].angles);
  const [draftAngle, setDraftAngle] = useState("");
  const [companies, setCompanies] = useState<DiscoveredCompany[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [savingKey, setSavingKey] = useState("");

  function applyPreset(id: string) {
    const preset = ICP_PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setPresetId(id);
    setAngles(preset.angles);
  }

  function addAngle() {
    const value = draftAngle.trim();
    if (value.length < 3 || angles.length >= 4) return;
    setAngles((current) => [...current, value]);
    setDraftAngle("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (angles.length === 0) return;
    setError("");
    setNotice("");
    startTransition(async () => {
      try {
        const result = await apiJson<{
          companies: DiscoveredCompany[];
          anglesRun: number;
          failedAngles: string[];
        }>("/api/signal-room/discover", {
          method: "POST",
          body: JSON.stringify({ angles, limit: 8 }),
        });
        setCompanies(result.companies);
        setNotice(
          `${result.companies.length} candidates from ${result.anglesRun} angle${result.anglesRun === 1 ? "" : "s"}.` +
            (result.failedAngles.length > 0
              ? ` ${result.failedAngles.length} angle timed out.`
              : "")
        );
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Discovery failed.");
      }
    });
  }

  const selectedPreset = ICP_PRESETS.find((item) => item.id === presetId);

  return (
    <div>
      <PanelHeading
        eyebrow="Step 1"
        title="Find targets"
        action={icp ? <StatusBadge tone="good">ICP v{icp.version}</StatusBadge> : null}
      />

      <form onSubmit={submit} className="mt-7 border border-border bg-card p-5 md:p-7">
        <p className="consulting-kicker text-signal">Who are you looking for?</p>
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          Each profile maps to one of your engagements and comes with the search angles
          that surface it.
        </p>

        <div className="mt-4 grid gap-2 lg:grid-cols-2">
          {ICP_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className={`focus-ring rounded-sm border p-4 text-left transition-colors ${
                presetId === preset.id
                  ? "border-signal bg-signal/5"
                  : "border-border hover:border-foreground"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold">{preset.label}</p>
                {presetId === preset.id ? <StatusBadge tone="good">selected</StatusBadge> : null}
              </div>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{preset.summary}</p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-signal">
                {preset.offer}
              </p>
            </button>
          ))}
        </div>

        {selectedPreset ? (
          <p className="mt-4 border-l-2 border-signal pl-3 text-[11px] leading-5 text-muted-foreground">
            <span className="text-foreground">Weakness to measure yourself:</span>{" "}
            {selectedPreset.measurableWeakness}
          </p>
        ) : null}

        <div className="mt-6 border-t border-border pt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold">Search angles</p>
            <span className="font-mono text-[10px] text-muted-foreground">{angles.length}/4</span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
            Each angle is a separate search. They run in parallel and results are merged —
            a company found by more than one angle ranks higher.
          </p>

          <div className="mt-3 space-y-2">
            {angles.map((angle, index) => (
              <div key={angle} className="flex items-start gap-3 border border-border bg-background p-3">
                <span className="mt-0.5 font-mono text-[9px] text-signal">{index + 1}</span>
                <p className="flex-1 text-[11px] leading-5">{angle}</p>
                <button
                  type="button"
                  onClick={() => setAngles((current) => current.filter((item) => item !== angle))}
                  className="focus-ring rounded-sm text-muted-foreground hover:text-destructive"
                  aria-label={`Remove angle: ${angle}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {angles.length === 0 ? (
              <p className="border border-dashed border-border p-3 text-[11px] text-muted-foreground">
                Add at least one angle.
              </p>
            ) : null}
          </div>

          {angles.length < 4 ? (
            <div className="mt-3 flex gap-2">
              <StudioInput
                value={draftAngle}
                onChange={(event) => setDraftAngle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addAngle();
                  }
                }}
                placeholder="Add your own angle"
                aria-label="Add a search angle"
              />
              <StudioButton type="button" variant="secondary" onClick={addAngle}>
                <Plus className="h-4 w-4" />
                Add
              </StudioButton>
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-5 text-muted-foreground">
            {icp
              ? `Stages from ICP v${icp.version}: ${icp.stages.join(", ")}`
              : "Seed to Series B, global. Tune under Advanced."}
          </p>
          <StudioButton type="submit" loading={isPending} disabled={angles.length === 0}>
            <Search className="h-4 w-4" />
            Search {angles.length} angle{angles.length === 1 ? "" : "s"}
          </StudioButton>
        </div>
      </form>

      {notice ? (
        <p className="mt-5 border-l-2 border-signal bg-signal/5 px-4 py-3 text-xs text-muted-foreground">
          {notice}
        </p>
      ) : null}

      {error ? <p className="mt-5 border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">{error}</p> : null}

      <section className="mt-8">
        <div className="flex items-center justify-between border-b border-foreground pb-3">
          <h2 className="text-sm font-semibold">Candidates</h2>
          <span className="font-mono text-[10px] text-muted-foreground">{companies.length} found</span>
        </div>

        {companies.length === 0 ? (
          <div className="grid min-h-64 place-items-center border-b border-border text-center">
            <div>
              <Radar className="mx-auto h-6 w-6 text-signal" />
              <p className="mt-4 text-sm font-semibold">No discovery run yet</p>
              <p className="mt-2 text-xs text-muted-foreground">Search results retain the public URLs used to find each company.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border border-b border-border">
            {companies.map((company) => {
              const candidateKey = getAccountIdentityKey(
                company.name,
                company.website
              );
              const saved = savedAccountKeys.has(candidateKey);
              return (
                <article key={`${company.name}-${company.website}`} className="grid gap-5 py-6 xl:grid-cols-[0.7fr_1.3fr_140px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold">{company.name}</h3>
                      <StatusBadge>{company.stage}</StatusBadge>
                      {company.websiteConfidence === "resolved" ? (
                        <StatusBadge tone="warn">site auto-found</StatusBadge>
                      ) : null}
                      {!company.website ? (
                        <StatusBadge tone="warn">no site</StatusBadge>
                      ) : null}
                      {(company.matchedAngles?.length ?? 0) > 1 ? (
                        <StatusBadge tone="good">
                          {company.matchedAngles?.length} angles
                        </StatusBadge>
                      ) : null}
                    </div>
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-signal hover:underline"
                      >
                        {new URL(company.website).hostname.replace(/^www\./, "")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                    <p className="mt-2 text-xs text-muted-foreground">{company.location}</p>
                    <p className="mt-3 text-sm leading-6">{company.oneLiner}</p>
                    {company.websiteConfidence === "resolved" ? (
                      <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                        Domain guessed from the name and confirmed by loading it. Check it is
                        the right company before researching.
                      </p>
                    ) : null}
                    {!company.website ? (
                      <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                        No official site found. Open a source to find it, then paste it in
                        after saving.
                      </p>
                    ) : null}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Signal label="Fit" body={company.whyItFits} />
                    <Signal label="Trigger" body={company.trigger} />
                    <div className="sm:col-span-2">
                      <p className="consulting-kicker text-muted-foreground">Sources</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                        {company.sourceUrls.map((url) => (
                          <a key={url} href={url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs text-signal hover:underline">
                            {new URL(url).hostname.replace(/^www\./, "")}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                    <details className="sm:col-span-2 border-t border-border pt-3">
                      <summary className="focus-ring cursor-pointer rounded-sm text-xs font-semibold text-signal">
                        Score breakdown
                      </summary>
                      <div className="mt-3 divide-y divide-border border-y border-border">
                        {company.fitBreakdown.map((dimension) => (
                          <div
                            key={dimension.id}
                            className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:items-start"
                          >
                            <div>
                              <p className="text-xs font-semibold">
                                {dimension.label}
                              </p>
                              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                                {dimension.reason}
                              </p>
                            </div>
                            <p className="font-mono text-xs tabular-nums">
                              {dimension.score}/{dimension.maxScore}
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                  <div className="self-start">
                    <div className="border border-border bg-card p-4 text-center">
                      <p className="consulting-kicker text-muted-foreground">
                        Suggested fit
                      </p>
                      <p className={`consulting-display mt-2 text-4xl ${getScoreColor(company.fitScore)}`}>
                        {company.fitScore}
                      </p>
                      <p className="mt-1 text-[10px] capitalize text-muted-foreground">
                        {company.fitConfidence} evidence
                      </p>
                    </div>
                    <StudioButton
                      variant={saved ? "secondary" : "primary"}
                      disabled={saved || savingKey === candidateKey}
                      loading={savingKey === candidateKey}
                      onClick={async () => {
                        setSavingKey(candidateKey);
                        try {
                          await onSave(company);
                        } finally {
                          setSavingKey("");
                        }
                      }}
                      className="mt-3 w-full"
                    >
                      <Plus className="h-4 w-4" />
                      {saved ? "Saved" : "Save"}
                    </StudioButton>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Signal({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="consulting-kicker text-signal">{label}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-signal";
  if (score >= 65) return "text-brass";
  return "text-muted-foreground";
}