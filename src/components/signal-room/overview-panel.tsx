"use client";

import { ArrowRight, CircleDot, FilePenLine, FlaskConical, PhoneCall, Radar } from "lucide-react";
import type { Account, IcpProfile, PostDraft } from "@/lib/signal-room/types";
import { PanelHeading, StatusBadge, StudioButton } from "@/components/signal-room/ui";

type OverviewView = "icp" | "discover" | "accounts" | "calls" | "posts";

export function OverviewPanel({
  accounts,
  posts,
  icp,
  onNavigate,
}: {
  accounts: Account[];
  posts: PostDraft[];
  icp: IcpProfile | null;
  onNavigate: (view: OverviewView) => void;
}) {
  const readyAccounts = accounts.filter((account) => account.status === "ready");
  const researchQueue = accounts.filter((account) => ["watchlist", "researching"].includes(account.status));
  const readyPosts = posts.filter((post) => post.status === "ready");
  const highPriority = accounts
    .filter((account) => account.priority === "high" && account.status !== "archived")
    .toSorted((a, b) => b.fitScore - a.fitScore)
    .slice(0, 5);

  // Methodology-specific counters.
  const active = accounts.filter((account) => account.status !== "archived");
  const withFieldTest = active.filter((account) => account.observations.length > 0);
  const needFieldTest = active.filter(
    (account) =>
      account.observations.length === 0 &&
      ["ready", "researching", "contacted"].includes(account.status)
  );
  const awaitingReply = active.filter((account) => account.status === "contacted");
  const inConversation = active.filter((account) => account.status === "replied");

  return (
    <div>
      <PanelHeading
        eyebrow="Operator dashboard"
        title="Signal Room"
        action={
          <StudioButton onClick={() => onNavigate(icp ? "discover" : "icp")}>
            <Radar className="h-4 w-4" />
            {icp ? "Find targets" : "Lock an ICP"}
          </StudioButton>
        }
      />

      {!icp ? (
        <button
          onClick={() => onNavigate("icp")}
          className="focus-ring mt-6 block w-full border-l-2 border-brass bg-brass/5 px-4 py-3 text-left text-xs leading-5 text-brass"
        >
          No ICP is locked. Discovery stays closed until you commit to who you are targeting.
        </button>
      ) : null}

      <dl className="mt-7 grid border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Active accounts" value={active.length} />
        <Metric label="Field tested" value={withFieldTest.length} />
        <Metric label="Awaiting reply" value={awaitingReply.length} />
        <Metric label="In conversation" value={inConversation.length} />
      </dl>

      {needFieldTest.length > 0 ? (
        <button
          onClick={() => onNavigate("accounts")}
          className="focus-ring mt-5 block w-full border border-brass/30 bg-brass/5 px-4 py-4 text-left"
        >
          <p className="text-xs font-semibold text-brass">
            {needFieldTest.length} account{needFieldTest.length === 1 ? "" : "s"} researched but never used
          </p>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
            The opener needs a number you measured yourself. Sign up, run the flow, log one
            observation — {needFieldTest.slice(0, 3).map((account) => account.name).join(", ")}
            {needFieldTest.length > 3 ? ` and ${needFieldTest.length - 3} more` : ""}.
          </p>
        </button>
      ) : null}

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <section>
          <div className="flex items-center justify-between border-b border-foreground pb-3">
            <h2 className="text-sm font-semibold">Priority accounts</h2>
            <button onClick={() => onNavigate("accounts")} className="focus-ring rounded-sm text-xs text-signal hover:underline">
              Open pipeline
            </button>
          </div>
          <div>
            {highPriority.length > 0 ? (
              highPriority.map((account) => (
                <button
                  key={account.id}
                  onClick={() => onNavigate("accounts")}
                  className="focus-ring grid w-full gap-3 border-b border-border py-4 text-left sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <div>
                    <p className="text-sm font-semibold">{account.name}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{account.oneLiner}</p>
                  </div>
                  <StatusBadge tone={account.status === "ready" ? "good" : "neutral"}>{account.status}</StatusBadge>
                  <span className="consulting-display text-xl">{account.fitScore}</span>
                </button>
              ))
            ) : (
              <EmptyLine label="No high-priority accounts yet." />
            )}
          </div>
        </section>

        <section>
          <div className="border-b border-foreground pb-3">
            <h2 className="text-sm font-semibold">Next actions</h2>
          </div>
          <div className="divide-y divide-border">
            <ActionLine
              icon={Radar}
              label="Build the target list"
              detail={`${researchQueue.length} accounts waiting for evidence`}
              onClick={() => onNavigate("discover")}
            />
            <ActionLine
              icon={FlaskConical}
              label="Use the product"
              detail={`${needFieldTest.length} researched but never measured`}
              onClick={() => onNavigate("accounts")}
            />
            <ActionLine
              icon={CircleDot}
              label="Prepare outreach"
              detail={`${readyAccounts.length} briefs ready to review`}
              onClick={() => onNavigate("accounts")}
            />
            <ActionLine
              icon={PhoneCall}
              label="Run the cost math"
              detail={`${inConversation.length} in conversation`}
              onClick={() => onNavigate("calls")}
            />
            <ActionLine
              icon={FilePenLine}
              label="Maintain content cadence"
              detail={`${posts.filter((post) => post.status === "draft").length} drafts in progress`}
              onClick={() => onNavigate("posts")}
            />
          </div>
        </section>
      </div>

      <section className="mt-10 border-t border-foreground pt-5">
        <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="consulting-kicker text-signal">Editorial rotation</p>
            <h2 className="consulting-display mt-2 text-2xl">Three kinds of authority</h2>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-3">
            {[
              ["Technical field note", posts.filter((post) => post.pillar === "Technical field note").length],
              ["Startup strategy", posts.filter((post) => post.pillar === "Startup strategy").length],
              ["Operator story", posts.filter((post) => post.pillar === "Operator story").length],
            ].map(([pillar, count]) => (
              <button key={pillar} onClick={() => onNavigate("posts")} className="focus-ring bg-card p-5 text-left hover:bg-secondary/60">
                <p className="text-xs text-muted-foreground">{pillar}</p>
                <p className="consulting-display mt-5 text-2xl">{count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card p-5">
      <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="consulting-display mt-4 text-3xl">{value}</dd>
    </div>
  );
}

function ActionLine({ icon: Icon, label, detail, onClick }: { icon: typeof Radar; label: string; detail: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="focus-ring group flex w-full items-center gap-4 py-4 text-left">
      <Icon className="h-4 w-4 shrink-0 text-signal" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{detail}</span>
      </span>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </button>
  );
}

function EmptyLine({ label }: { label: string }) {
  return <p className="py-8 text-sm text-muted-foreground">{label}</p>;
}