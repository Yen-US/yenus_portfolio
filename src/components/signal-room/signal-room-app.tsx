"use client";

import { Building2, FilePenLine, LayoutDashboard, Radar, ShieldAlert } from "lucide-react";
import { useState } from "react";
import type { Account, DiscoveredCompany, PostDraft, WorkspaceData } from "@/lib/signal-room/types";
import { apiJson, getAccountIdentityKey } from "@/lib/signal-room/client";
import { cn } from "@/lib/utils";
import { DiscoverPanel } from "@/components/signal-room/discover-panel";
import { OverviewPanel } from "@/components/signal-room/overview-panel";
import { AccountsPanel } from "@/components/signal-room/accounts-panel";
import { PostLabPanel } from "@/components/signal-room/post-lab-panel";
import { StatusBadge } from "@/components/signal-room/ui";

type View = "overview" | "discover" | "accounts" | "posts";

const navigation: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "discover", label: "Discover", icon: Radar },
  { id: "accounts", label: "Accounts", icon: Building2 },
  { id: "posts", label: "Post Lab", icon: FilePenLine },
];

export function SignalRoomApp({ initialData }: { initialData: WorkspaceData }) {
  const [view, setView] = useState<View>("overview");
  const [accounts, setAccounts] = useState(initialData.accounts);
  const [posts, setPosts] = useState(initialData.posts);

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
          id: `demo-${crypto.randomUUID()}`,
          sources: [],
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
              {navigation.map((item) => (
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
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto hidden border-t border-background/15 p-4 lg:block">
              <div className="flex items-start gap-3 text-[11px] leading-5 text-background/55">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-brass-soft" />
                <p>Unlinked and noindex. This route is obscured, not authenticated.</p>
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
            {view === "overview" ? <OverviewPanel accounts={accounts} posts={posts} onNavigate={setView} /> : null}
            {view === "discover" ? <DiscoverPanel savedAccountKeys={savedAccountKeys} onSave={saveDiscoveredCompany} /> : null}
            {view === "accounts" ? (
              <AccountsPanel accounts={accounts} mode={initialData.mode} onAccountsChange={setAccounts} />
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
