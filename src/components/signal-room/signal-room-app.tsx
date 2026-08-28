"use client";

import { Building2, ChevronRight, Crosshair, FilePenLine, LayoutDashboard, Linkedin, ListChecks, PhoneCall, Radar, ShieldCheck, TrendingUp } from "lucide-react";
import { useState } from "react";
import type {
  Account,
  ContentMetricSnapshot,
  ContentPost,
  DiscoveredCompany,
  IcpProfile,
  PostDraft,
  ProfileVersion,
  SalesEvent,
  WorkspaceData,
} from "@/lib/signal-room/types";
import type { LedgerData } from "@/lib/signal-room/ledger-store";
import { apiJson, getAccountIdentityKey, emptyAccountRelations, NEW_ACCOUNT_DEFAULTS } from "@/lib/signal-room/client";
import { cn } from "@/lib/utils";
import { DiscoverPanel } from "@/components/signal-room/discover-panel";
import { OverviewPanel } from "@/components/signal-room/overview-panel";
import { AccountsPanel } from "@/components/signal-room/accounts-panel";
import { CallPanel } from "@/components/signal-room/call-panel";
import { IcpPanel } from "@/components/signal-room/icp-panel";
import { PostLabPanel } from "@/components/signal-room/post-lab-panel";
import { TodayPanel } from "@/components/signal-room/today-panel";
import { FunnelPanel } from "@/components/signal-room/funnel-panel";
import { LinkedInPanel } from "@/components/signal-room/linkedin-panel";
import { StatusBadge } from "@/components/signal-room/ui";

type View =
  | "today"
  | "discover"
  | "accounts"
  | "calls"
  | "icp"
  | "posts"
  | "overview"
  | "funnel"
  | "linkedin";

/**
 * Today leads, because the question the workspace exists to answer is "what do
 * I do now" — and answering it from the ledger is cheaper than remembering.
 */
const primaryNav: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "today", label: "Today", icon: ListChecks },
  { id: "discover", label: "Find targets", icon: Radar },
  { id: "accounts", label: "Research & write", icon: Building2 },
  { id: "calls", label: "Calls", icon: PhoneCall },
];

/** Everything that is useful later but must not compete for attention now. */
const advancedNav: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "funnel", label: "Funnel", icon: TrendingUp },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "icp", label: "ICP tuning", icon: Crosshair },
  { id: "posts", label: "Post Lab", icon: FilePenLine },
];

export function SignalRoomApp({
  initialData,
  ledger,
}: {
  initialData: WorkspaceData;
  ledger: LedgerData;
}) {
  const [view, setView] = useState<View>("today");
  const [accounts, setAccounts] = useState(initialData.accounts);
  const [posts, setPosts] = useState(initialData.posts);
  const [icp, setIcp] = useState<IcpProfile | null>(initialData.icp);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [events, setEvents] = useState<SalesEvent[]>(ledger.events);
  const [contentPosts, setContentPosts] = useState<ContentPost[]>(ledger.posts);
  const [metrics, setMetrics] = useState<ContentMetricSnapshot[]>(ledger.metrics);
  const [profiles, setProfiles] = useState<ProfileVersion[]>(ledger.profiles);

  async function saveDiscoveredCompany(company: DiscoveredCompany) {
    const accountInput = {
      name: company.name,
      website: company.website,
      stage: company.stage,
      location: company.location,
      oneLiner: company.oneLiner,
      status: "watchlist" as const,
      fitScore: company.fitScore,
      priority: getSuggestedPriority(company.fitScore),
      founderNames: [],
      linkedinUrl: "",
      notes: `${company.website ? "" : "Official website unverified.\n"}Suggested fit: ${company.fitScore}/100 (${company.fitConfidence} evidence)\n${company.fitBreakdown.map((dimension) => `- ${dimension.label}: ${dimension.score}/${dimension.maxScore} - ${dimension.reason}`).join("\n")}\nDiscovery trigger: ${company.trigger}\nWhy it fits: ${company.whyItFits}\nSources:\n${company.sourceUrls.join("\n")}`,
      brief: null,
    };

    if (initialData.mode === "demo") {
      const now = new Date().toISOString();
      setAccounts((current) => [
        {
          ...accountInput,
          ...NEW_ACCOUNT_DEFAULTS,
          ...emptyAccountRelations(),
          icpProfileId: initialData.icp?.id ?? null,
          id: `demo-${crypto.randomUUID()}`,
          createdAt: now,
          updatedAt: now,
        },
        ...current,
      ]);
      return;
    }

    const result = await apiJson<{ account: Account }>("/api/signal-room/accounts", {
      method: "POST",
      body: JSON.stringify(accountInput),
    });
    setAccounts((current) => [result.account, ...current]);
  }

  const savedAccountKeys = new Set(
    accounts.map((account) =>
      getAccountIdentityKey(account.name, account.website)
    )
  );

  return (
    <div className="consulting-shell min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[224px_1fr]">
        <aside className="w-full min-w-0 max-w-full overflow-hidden border-b border-border bg-foreground text-background lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="flex h-[72px] items-center gap-3 border-b border-background/15 px-5">
              <span className="grid h-9 w-9 place-items-center bg-signal font-mono text-[10px] font-semibold text-white">SR</span>
              <div>
                <p className="text-sm font-semibold">Signal Room</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-background/45">Yenson · Private ops</p>
              </div>
            </div>

            <nav aria-label="Signal Room" className="flex w-full max-w-full gap-1 overflow-x-auto p-3 lg:flex-col lg:p-4">
              {primaryNav.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={cn(
                    "focus-ring flex min-h-10 shrink-0 items-center gap-3 rounded-sm px-3 text-sm transition-colors",
                    view === item.id
                      ? "bg-background text-foreground"
                      : "text-background/60 hover:bg-background/10 hover:text-background"
                  )}
                >
                  <span className="font-mono text-[9px] text-signal">{index + 1}</span>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => setShowAdvanced((current) => !current)}
                className="focus-ring mt-1 flex min-h-9 shrink-0 items-center gap-2 rounded-sm px-3 text-[11px] text-background/40 transition-colors hover:text-background/70 lg:mt-4 lg:border-t lg:border-background/15 lg:pt-4"
                aria-expanded={showAdvanced}
              >
                <ChevronRight className={cn("h-3 w-3 transition-transform", showAdvanced && "rotate-90")} />
                Advanced
              </button>

              {showAdvanced
                ? advancedNav.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={cn(
                        "focus-ring flex min-h-9 shrink-0 items-center gap-3 rounded-sm px-3 text-xs transition-colors lg:pl-8",
                        view === item.id
                          ? "bg-background text-foreground"
                          : "text-background/50 hover:bg-background/10 hover:text-background"
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </button>
                  ))
                : null}
            </nav>

            <div className="mt-auto hidden border-t border-background/15 p-4 lg:block">
              <div className="flex items-start gap-3 text-[11px] leading-5 text-background/55">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brass-soft" />
                <p>Password-gated and noindex. Sessions expire after 14 days.</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 max-w-full overflow-x-hidden">
          <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:px-7">
            <div>
              <p className="text-sm font-semibold">Startup research & content</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Global · Seed to Series B · Manual outreach</p>
            </div>
            <StatusBadge tone={initialData.mode === "supabase" ? "good" : "warn"}>
              {initialData.mode === "supabase" ? "Supabase live" : "Demo mode"}
            </StatusBadge>
          </header>

          {initialData.mode === "demo" ? (
            <div className="border-b border-brass/25 bg-brass/5 px-4 py-3 text-xs leading-5 text-brass md:px-7">
              Demo mode: research and generated drafts work, but saves last only for this browser session. Run the Supabase schema and add server credentials for durable storage.
            </div>
          ) : null}

          <main className="mx-auto w-full max-w-[1500px] p-4 md:p-7 lg:p-9">
            {view === "today" ? (
              <TodayPanel
                accounts={accounts}
                events={events}
                posts={contentPosts}
                onEventRecorded={(event) =>
                  setEvents((current) =>
                    current.some((existing) => existing.id === event.id)
                      ? current
                      : [...current, event]
                  )
                }
              />
            ) : null}
            {view === "funnel" ? (
              <FunnelPanel
                accounts={accounts}
                events={events}
                posts={contentPosts}
                metrics={metrics}
              />
            ) : null}
            {view === "linkedin" ? (
              <LinkedInPanel
                posts={contentPosts}
                metrics={metrics}
                profiles={profiles}
                capabilities={ledger.capabilities}
                onPostsChanged={(post) => setContentPosts((c) => [post, ...c])}
                onMetricsChanged={(snapshot) =>
                  setMetrics((current) => [
                    snapshot,
                    ...current.filter((existing) => existing.id !== snapshot.id),
                  ])
                }
                onProfilesChanged={(version) => setProfiles((c) => [version, ...c])}
              />
            ) : null}
            {view === "overview" ? (
              <OverviewPanel accounts={accounts} posts={posts} icp={icp} onNavigate={setView} />
            ) : null}
            {view === "icp" ? (
              <IcpPanel
                icp={icp}
                accounts={accounts}
                mode={initialData.mode}
                onIcpChange={setIcp}
              />
            ) : null}
            {view === "discover" ? (
              <DiscoverPanel icp={icp} savedAccountKeys={savedAccountKeys} onSave={saveDiscoveredCompany} />
            ) : null}
            {view === "accounts" ? (
              <AccountsPanel accounts={accounts} mode={initialData.mode} onAccountsChange={setAccounts} />
            ) : null}
            {view === "calls" ? (
              <CallPanel accounts={accounts} mode={initialData.mode} onAccountsChange={setAccounts} />
            ) : null}
            {view === "posts" ? (
              <PostLabPanel
                accounts={accounts}
                posts={posts}
                mode={initialData.mode}
                onPostsChange={setPosts}
              />
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}

function getSuggestedPriority(score: number) {
  if (score >= 80) return "high" as const;
  if (score >= 65) return "medium" as const;
  return "low" as const;
}
