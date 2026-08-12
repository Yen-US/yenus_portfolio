"use client";

import {
  ArrowUpRight,
  Building2,
  ExternalLink,
  FileSearch,
  FlaskConical,
  Link2,
  MessageSquareText,
  MessagesSquare,
  Plus,
  Save,
} from "lucide-react";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { apiJson, emptyAccountRelations, NEW_ACCOUNT_DEFAULTS } from "@/lib/signal-room/client";
import { FieldTestView } from "@/components/signal-room/field-test-view";
import { ConversationView } from "@/components/signal-room/conversation-view";
import type {
  Account,
  AccountStatus,
  ResearchBrief,
  ResearchSource,
  StartupStage,
} from "@/lib/signal-room/types";
import { ACCOUNT_STATUSES } from "@/lib/signal-room/types";
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

type DetailView = "brief" | "outreach" | "conversation" | "fieldtest" | "sources";

export function AccountsPanel({
  accounts,
  mode,
  onAccountsChange,
}: {
  accounts: Account[];
  mode: "supabase" | "demo";
  onAccountsChange: (accounts: Account[]) => void;
}) {
  const [selectedId, setSelectedId] = useState(accounts[0]?.id ?? "");
  const [filter, setFilter] = useState("");
  const [showNew, setShowNew] = useState(false);
  const selected = accounts.find((account) => account.id === selectedId) ?? accounts[0] ?? null;

  useEffect(() => {
    if (!selectedId && accounts[0]) setSelectedId(accounts[0].id);
  }, [accounts, selectedId]);

  const filteredAccounts = accounts.filter((account) =>
    `${account.name} ${account.oneLiner} ${account.stage}`.toLowerCase().includes(filter.toLowerCase())
  );

  function upsertAccount(account: Account) {
    onAccountsChange(
      accounts.some((item) => item.id === account.id)
        ? accounts.map((item) => (item.id === account.id ? account : item))
        : [account, ...accounts]
    );
    setSelectedId(account.id);
  }

  return (
    <div>
      <PanelHeading
        eyebrow="Step 2"
        title="Research & write"
        action={
          <StudioButton onClick={() => setShowNew((current) => !current)}>
            <Plus className="h-4 w-4" />
            Add startup
          </StudioButton>
        }
      />

      {showNew ? (
        <NewAccountForm
          mode={mode}
          onCreated={(account) => {
            upsertAccount(account);
            setShowNew(false);
          }}
        />
      ) : null}

      <div className="mt-7 grid gap-7 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside>
          <StudioInput
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter accounts"
            aria-label="Filter accounts"
          />
          <div className="mt-3 border-t border-foreground">
            {filteredAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => setSelectedId(account.id)}
                className={`focus-ring w-full border-b border-border px-3 py-4 text-left transition-colors ${
                  selected?.id === account.id ? "bg-secondary" : "hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{account.name}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{account.stage} · {account.location || "Location unknown"}</p>
                  </div>
                  <span className="consulting-display text-xl">{account.fitScore}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <StatusBadge tone={account.status === "ready" ? "good" : "neutral"}>{account.status}</StatusBadge>
                  <StatusBadge tone={account.priority === "high" ? "warn" : "neutral"}>{account.priority}</StatusBadge>
                </div>
              </button>
            ))}
            {filteredAccounts.length === 0 ? (
              <p className="border-b border-border px-3 py-8 text-sm text-muted-foreground">No matching accounts.</p>
            ) : null}
          </div>
        </aside>

        {selected ? (
          <AccountDetail
            key={selected.id}
            account={selected}
            mode={mode}
            onChange={upsertAccount}
          />
        ) : (
          <div className="grid min-h-96 place-items-center border border-dashed border-border text-center">
            <div>
              <Building2 className="mx-auto h-6 w-6 text-signal" />
              <p className="mt-4 text-sm font-semibold">Add the first startup</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AccountDetail({
  account,
  mode,
  onChange,
}: {
  account: Account;
  mode: "supabase" | "demo";
  onChange: (account: Account) => void;
}) {
  const [detailView, setDetailView] = useState<DetailView>(account.brief ? "brief" : "sources");  const [urls, setUrls] = useState(
    [account.website, ...account.sources.map((source) => source.url)].filter(Boolean).filter((value, index, all) => all.indexOf(value) === index).join("\n")
  );
  const [manualContext, setManualContext] = useState("");
  const [status, setStatus] = useState<AccountStatus>(account.status);
  const [priority, setPriority] = useState(account.priority);
  const [fitScore, setFitScore] = useState(account.fitScore);
  const [notes, setNotes] = useState(account.notes);
  const [targetName, setTargetName] = useState(account.targetName);
  const [targetRole, setTargetRole] = useState(account.targetRole);
  const [error, setError] = useState("");
  const [failures, setFailures] = useState<{ url: string; error: string }[]>([]);
  const [isResearching, startResearch] = useTransition();
  const [isSaving, startSave] = useTransition();

  function runResearch() {
    setError("");
    startResearch(async () => {
      try {
        const result = await apiJson<{
          brief: ResearchBrief;
          sources: ResearchSource[];
          failures: { url: string; error: string }[];
        }>("/api/signal-room/research", {
          method: "POST",
          body: JSON.stringify({
            accountId: account.id,
            account: {
              name: account.name,
              website: account.website,
              stage: account.stage,
              location: account.location,
              oneLiner: account.oneLiner,
              notes,
            },
            urls: urls.split("\n").map((url) => url.trim()).filter(Boolean),
            manualContext,
            observations: account.observations,
            persist: mode === "supabase",
          }),
        });
        setFailures(result.failures);
        onChange({ ...account, notes, brief: result.brief, sources: result.sources, status: "ready", updatedAt: new Date().toISOString() });
        setStatus("ready");
        setDetailView("brief");
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Research failed.");
      }
    });
  }

  /**
   * Status saves on change rather than waiting for "Save account fields".
   * That button lives inside the Research tab, so changing status from any
   * other tab used to look saved and silently revert on reselect.
   */
  function saveStatus(nextStatus: AccountStatus) {
    const previous = status;
    setStatus(nextStatus);
    setError("");
    startSave(async () => {
      const next = { ...account, status: nextStatus, updatedAt: new Date().toISOString() };
      if (mode !== "supabase") {
        onChange(next);
        return;
      }
      try {
        const result = await apiJson<{ account: Account }>("/api/signal-room/accounts", {
          method: "PATCH",
          body: JSON.stringify({
            id: account.id,
            status: nextStatus,
            priority,
            fitScore,
            notes,
            targetName,
            targetRole,
          }),
        });
        onChange({
          ...result.account,
          brief: account.brief,
          sources: account.sources,
          observations: account.observations,
          messages: account.messages,
          call: account.call,
        });
      } catch (requestError) {
        // Roll back so the control never shows a state the server rejected.
        setStatus(previous);
        setError(requestError instanceof Error ? requestError.message : "Status save failed.");
      }
    });
  }

  function saveAccount() {
    setError("");
    startSave(async () => {
      const next = { ...account, status, priority, fitScore, notes, targetName, targetRole, updatedAt: new Date().toISOString() };
      try {
        if (mode === "supabase") {
          const result = await apiJson<{ account: Account }>("/api/signal-room/accounts", {
            method: "PATCH",
            body: JSON.stringify({ id: account.id, status, priority, fitScore, notes, targetName, targetRole }),
          });
          onChange({
            ...result.account,
            brief: account.brief,
            sources: account.sources,
            observations: account.observations,
            messages: account.messages,
            call: account.call,
          });
        } else {
          onChange(next);
        }
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Save failed.");
      }
    });
  }

  return (
    <section className="min-w-0">
      <div className="flex flex-col gap-5 border-b border-foreground pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="consulting-display text-3xl">{account.name}</h2>
            <StatusBadge>{account.stage}</StatusBadge>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{account.oneLiner}</p>
          {account.website ? (
            <a href={account.website} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1 text-xs text-signal hover:underline">
              {new URL(account.website).hostname.replace(/^www\./, "")}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </div>
        <div className="grid grid-cols-3 gap-3 md:w-[360px]">
          <Field label="Status">
            <StudioSelect value={status} onChange={(event) => saveStatus(event.target.value as AccountStatus)}>
              {ACCOUNT_STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
            </StudioSelect>
          </Field>
          <Field label="Priority">
            <StudioSelect value={priority} onChange={(event) => setPriority(event.target.value as Account["priority"])}>
              <option>high</option><option>medium</option><option>low</option>
            </StudioSelect>
          </Field>
          <Field label="Fit score">
            <StudioInput type="number" min={0} max={100} value={fitScore} onChange={(event) => setFitScore(Number(event.target.value))} />
          </Field>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1 border-b border-border">
        {([
          ["sources", "1 · Research", Link2],
          ["brief", "2 · Brief", FileSearch],
          ["fieldtest", "3 · Use their product", FlaskConical],
          ["conversation", "4 · Write & send", MessagesSquare],
          ["outreach", "Extras", MessageSquareText],
        ] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setDetailView(id)} className={`focus-ring inline-flex min-h-10 items-center gap-2 border-b-2 px-4 text-xs font-semibold ${detailView === id ? "border-signal text-signal" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </div>

      {error ? <p className="mt-5 border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">{error}</p> : null}

      {detailView === "brief" ? <BriefView brief={account.brief} /> : null}
      {detailView === "fieldtest" ? (
        <FieldTestView account={account} mode={mode} onChange={onChange} />
      ) : null}
      {detailView === "conversation" ? (
        <ConversationView account={account} mode={mode} onChange={onChange} />
      ) : null}
      {detailView === "outreach" ? <OutreachView brief={account.brief} /> : null}
      {detailView === "sources" ? (
        <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-5">
            <Field label="Public source URLs" hint="One URL per line. LinkedIn extraction is intentionally blocked.">
              <StudioTextarea value={urls} onChange={(event) => setUrls(event.target.value)} className="min-h-40 font-mono text-xs" />
            </Field>
            <Field label="Manual context" hint="Paste relevant LinkedIn text, founder comments, conference notes, or your own observations.">
              <StudioTextarea value={manualContext} onChange={(event) => setManualContext(event.target.value)} className="min-h-40" />
            </Field>
            <StudioButton onClick={runResearch} loading={isResearching}>
              <FileSearch className="h-4 w-4" />
              Build source-backed brief
            </StudioButton>
            {failures.length > 0 ? (
              <div className="border border-brass/25 bg-brass/5 p-4">
                <p className="text-xs font-semibold text-brass">Some pages could not be extracted</p>
                {failures.map((failure) => <p key={failure.url} className="mt-2 break-all text-[11px] leading-5 text-muted-foreground">{failure.url}: {failure.error}</p>)}
              </div>
            ) : null}
          </div>
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Target contact" hint="Found manually on LinkedIn.">
                <StudioInput
                  value={targetName}
                  onChange={(event) => setTargetName(event.target.value)}
                  placeholder="Full name"
                />
              </Field>
              <Field label="Their role" hint="CTO first; PM or founding engineer as fallback.">
                <StudioInput
                  value={targetRole}
                  onChange={(event) => setTargetRole(event.target.value)}
                  placeholder="CTO"
                />
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Pipeline notes">
                <StudioTextarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-40" />
              </Field>
            </div>
            <StudioButton variant="secondary" onClick={saveAccount} loading={isSaving} className="mt-4">
              <Save className="h-4 w-4" />
              Save account fields
            </StudioButton>
            <div className="mt-7 border-t border-border pt-5">
              <p className="consulting-kicker text-muted-foreground">Captured sources</p>
              {account.sources.map((source) => (
                <a key={source.id} href={source.url} target="_blank" rel="noopener" className="group mt-3 flex items-start justify-between gap-4 border-b border-border pb-3 text-xs">
                  <span><span className="font-semibold group-hover:text-signal">{source.title}</span><span className="mt-1 block text-muted-foreground">{source.sourceType}</span></span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function BriefView({ brief }: { brief: ResearchBrief | null }) {
  if (!brief) return <EmptyResearch />;
  return (
    <div className="mt-7 space-y-9">
      <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
        <ResearchBlock label="Account read" body={brief.summary} />
        <div className="grid gap-5 sm:grid-cols-2">
          <ResearchBlock label="Why now" body={brief.whyNow} />
          <ResearchBlock label="AI maturity" body={brief.aiMaturity} />
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-2">
        <div>
          <SectionTitle title="Verified evidence" count={brief.evidence.length} />
          <div className="divide-y divide-border border-t border-foreground">
            {brief.evidence.map((item) => (
              <div key={`${item.claim}-${item.sourceUrl}`} className="py-4">
                <p className="text-sm leading-6">{item.claim}</p>
                <a href={item.sourceUrl} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-1 text-[11px] text-signal hover:underline">
                  {item.sourceTitle}<ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle title="Architecture hypotheses" count={brief.architectureHypotheses.length} />
          <div className="divide-y divide-border border-t border-foreground">
            {brief.architectureHypotheses.map((item) => (
              <div key={item.hypothesis} className="py-4">
                <p className="text-sm font-semibold leading-6">{item.hypothesis}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Signal: {item.evidence}</p>
                <p className="mt-3 border-l-2 border-signal pl-3 text-xs leading-5">Validate: {item.questionToValidate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-7 md:grid-cols-2">
        <ListBlock label="Likely priorities" items={brief.likelyPriorities} />
        <ListBlock label="Uncertainties" items={brief.uncertainties} />
      </div>
    </div>
  );
}

function OutreachView({ brief }: { brief: ResearchBrief | null }) {
  if (!brief) return <EmptyResearch />;
  const outreach = brief.outreach;
  return (
    <div className="mt-7 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between"><SectionTitle title="Opening lines" count={outreach.openingLines.length} /><CopyButton text={outreach.openingLines.join("\n\n")} /></div>
          {outreach.openingLines.map((line) => <p key={line} className="border-t border-border py-4 text-sm leading-6">{line}</p>)}
        </div>
        <div>
          <div className="flex items-center justify-between"><SectionTitle title="Short message" /><CopyButton text={outreach.shortMessage} /></div>
          <p className="mt-3 whitespace-pre-wrap border border-border bg-card p-5 text-sm leading-7">{outreach.shortMessage}</p>
        </div>
      </div>
      <div className="space-y-8">
        <ListBlock label="Loom teardown outline" items={outreach.loomOutline} ordered />
        <ListBlock label="Discovery questions" items={outreach.discoveryQuestions} />
      </div>
    </div>
  );
}

function NewAccountForm({ mode, onCreated }: { mode: "supabase" | "demo"; onCreated: (account: Account) => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input = {
      name: String(data.get("name")), website: String(data.get("website")), stage: String(data.get("stage")) as StartupStage,
      location: String(data.get("location")), oneLiner: String(data.get("oneLiner")), status: "watchlist" as const,
      fitScore: 50, priority: "medium" as const, founderNames: [], linkedinUrl: "", notes: "", brief: null,
    };
    startTransition(async () => {
      try {
        if (mode === "supabase") {
          const result = await apiJson<{ account: Account }>("/api/signal-room/accounts", { method: "POST", body: JSON.stringify(input) });
          onCreated(result.account);
        } else {
          const now = new Date().toISOString();
          onCreated({
            ...input,
            ...NEW_ACCOUNT_DEFAULTS,
            ...emptyAccountRelations(),
            id: `demo-${crypto.randomUUID()}`,
            createdAt: now,
            updatedAt: now,
          });
        }
      } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Account creation failed."); }
    });
  }
  return (
    <form onSubmit={submit} className="mt-6 grid gap-4 border border-border bg-card p-5 md:grid-cols-2 xl:grid-cols-5">
      <Field label="Company"><StudioInput name="name" required /></Field>
      <Field label="Website"><StudioInput name="website" type="url" required /></Field>
      <Field label="Stage"><StudioSelect name="stage"><option>Seed</option><option>Series A</option><option>Series B</option><option>Unknown</option></StudioSelect></Field>
      <Field label="Location"><StudioInput name="location" /></Field>
      <Field label="One-liner"><StudioInput name="oneLiner" /></Field>
      <div className="flex items-end md:col-span-2 xl:col-span-5"><StudioButton type="submit" loading={isPending}><Plus className="h-4 w-4" />Add to pipeline</StudioButton></div>
      {error ? <p className="text-xs text-destructive md:col-span-2 xl:col-span-5">{error}</p> : null}
    </form>
  );
}

function ResearchBlock({ label, body }: { label: string; body: string }) { return <div><p className="consulting-kicker text-signal">{label}</p><p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p></div>; }
function SectionTitle({ title, count }: { title: string; count?: number }) { return <h3 className="text-sm font-semibold">{title}{count !== undefined ? <span className="ml-2 font-mono text-[10px] text-muted-foreground">{count}</span> : null}</h3>; }
function ListBlock({ label, items, ordered = false }: { label: string; items: string[]; ordered?: boolean }) { const Tag = ordered ? "ol" : "ul"; return <div><SectionTitle title={label} count={items.length} /><Tag className="mt-3 divide-y divide-border border-t border-foreground">{items.map((item, index) => <li key={item} className="flex gap-3 py-3 text-xs leading-5"><span className="font-mono text-[9px] text-signal">{ordered ? String(index + 1).padStart(2, "0") : "—"}</span>{item}</li>)}</Tag></div>; }
function EmptyResearch() { return <div className="grid min-h-72 place-items-center border-b border-border text-center"><div><FileSearch className="mx-auto h-6 w-6 text-signal" /><p className="mt-4 text-sm font-semibold">No research brief yet</p><p className="mt-2 text-xs text-muted-foreground">Add public sources and manual context in Sources & notes.</p></div></div>; }