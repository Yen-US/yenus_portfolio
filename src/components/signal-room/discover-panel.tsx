"use client";

import { ExternalLink, Plus, Radar, Search } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";
import { apiJson, getAccountIdentityKey } from "@/lib/signal-room/client";
import type { DiscoveredCompany, IcpProfile } from "@/lib/signal-room/types";
import {
  Field,
  PanelHeading,
  StatusBadge,
  StudioButton,
  StudioInput,
} from "@/components/signal-room/ui";

const searchPresets = [
  "Recently funded B2B AI startups moving a product from beta toward enterprise customers",
  "AI agent startups hiring platform, reliability, evaluation, or infrastructure engineers",
  "B2B RAG or vertical AI startups announcing production launches or enterprise pilots",
];

/** The methodology works a small batch at a time: about three targets. */
const TARGETS_PER_BATCH = 3;

export function DiscoverPanel({
  icp,
  savedAccountKeys,
  onSave,
}: {
  icp: IcpProfile | null;
  savedAccountKeys: Set<string>;
  onSave: (company: DiscoveredCompany) => Promise<void>;
}) {
  const [query, setQuery] = useState(searchPresets[0]);
  const [companies, setCompanies] = useState<DiscoveredCompany[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [savingKey, setSavingKey] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const result = await apiJson<{ companies: DiscoveredCompany[] }>("/api/signal-room/discover", {
          method: "POST",
          body: JSON.stringify({ query, count: TARGETS_PER_BATCH }),
        });
        setCompanies(result.companies);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Discovery failed.");
      }
    });
  }

  return (
    <div>
      <PanelHeading
        eyebrow="Step 1"
        title="Find targets"
        action={icp ? <StatusBadge tone="good">ICP v{icp.version}</StatusBadge> : null}
      />

      <form onSubmit={submit} className="mt-7 border border-border bg-card p-5 md:p-7">
        <Field
          label="What kind of company are you looking for?"
          hint={
            icp
              ? `Defaults from ICP v${icp.version}: ${icp.stages.join(", ")}`
              : "Seed to Series B B2B AI startups, global. Tune this later under Advanced."
          }
        >
          <StudioInput value={query} onChange={(event) => setQuery(event.target.value)} required minLength={3} />
        </Field>

        <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-5 text-muted-foreground">
            Returns up to {TARGETS_PER_BATCH} targets. Work one batch at a time.
          </p>
          <StudioButton type="submit" loading={isPending}>
            <Search className="h-4 w-4" />
            Search public signals
          </StudioButton>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
          {searchPresets.map((preset) => (
            <button key={preset} type="button" onClick={() => setQuery(preset)} className="focus-ring rounded-sm border border-border px-3 py-2 text-left text-[11px] leading-4 text-muted-foreground hover:border-signal hover:text-foreground">
              {preset}
            </button>
          ))}
        </div>
      </form>

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
                      {!company.website ? (
                        <StatusBadge tone="warn">site unverified</StatusBadge>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{company.location}</p>
                    <p className="mt-3 text-sm leading-6">{company.oneLiner}</p>
                    {!company.website ? (
                      <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                        No official site resolved from the citations. Open a source to find it,
                        then paste it in after saving.
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