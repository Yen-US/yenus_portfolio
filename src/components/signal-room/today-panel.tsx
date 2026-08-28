"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, ExternalLink, Inbox, RefreshCw } from "lucide-react";
import type {
  Account,
  ContentPost,
  SalesEvent,
  SalesEventType,
} from "@/lib/signal-room/types";
import { deriveAccountState } from "@/lib/signal-room/funnel";
import { apiJson } from "@/lib/signal-room/client";
import { PanelHeading, StatusBadge, StudioButton } from "@/components/signal-room/ui";

/**
 * The daily queue.
 *
 * Deterministic throughout — no model decides what is due or in what order.
 * A generator that reorders the list invisibly, or invents urgency to fill a
 * quiet day, would make the one view meant to be trusted the least trustworthy.
 *
 * Every action here writes an event and nothing else. Stage is re-derived from
 * the ledger on the next render rather than being set directly, so the queue
 * cannot drift away from the history that produced it.
 */
export function TodayPanel({
  accounts,
  events,
  posts,
  onEventRecorded,
}: {
  accounts: Account[];
  events: SalesEvent[];
  posts: ContentPost[];
  onEventRecorded: (event: SalesEvent) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const now = new Date();

  const states = useMemo(
    () =>
      accounts
        .filter((account) => account.status !== "archived")
        .map((account) => ({
          account,
          state: deriveAccountState(account.id, events, now),
        })),
    // `now` is intentionally excluded: recomputing on every tick would make the
    // list shuffle under the cursor mid-click.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accounts, events]
  );

  function record(accountId: string, type: SalesEventType, rowId: string) {
    setBusyId(rowId);
    setError(null);
    startTransition(async () => {
      try {
        const { event } = await apiJson<{ event: SalesEvent }>(
          "/api/signal-room/sales-events",
          { method: "POST", body: JSON.stringify({ accountId, type }) }
        );
        onEventRecorded(event);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not record that. Nothing was saved."
        );
      } finally {
        setBusyId(null);
      }
    });
  }

  const overdue = states.filter((row) => row.state.isOverdue);
  const dueToday = states.filter(
    (row) =>
      !row.state.isOverdue &&
      row.state.nextActionDueAt !== null &&
      isSameDay(new Date(row.state.nextActionDueAt), now)
  );
  const awaitingAcceptance = states.filter(
    (row) => row.state.stage === "connection_requested"
  );
  const awaitingFirstMessage = states.filter((row) => row.state.stage === "connected");
  const repliesToClassify = states.filter((row) => row.state.stage === "replied");
  const needFieldTest = states.filter(
    (row) => row.state.stage === "researched" && row.account.observations.length === 0
  );
  const metricsDue = useMemo(() => postsNeedingCapture(posts, now), [posts]);

  const totalDue =
    overdue.length +
    dueToday.length +
    awaitingAcceptance.length +
    awaitingFirstMessage.length +
    repliesToClassify.length +
    metricsDue.length;

  return (
    <div>
      <PanelHeading
        eyebrow="Today"
        title={totalDue === 0 ? "Nothing is due." : `${totalDue} things are due.`}
      />

      {error ? (
        <p
          className="mt-5 border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {events.length === 0 ? (
        <div className="mt-6 border border-border bg-secondary/40 p-5">
          <p className="text-sm font-semibold">The ledger is empty.</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Nothing has been logged yet, so this queue has nothing to derive from.
            Log what already happened on the account timeline — connection
            requests sent, anything accepted — and the follow-up dates appear
            here automatically.
          </p>
        </div>
      ) : null}

      {totalDue === 0 && events.length > 0 ? (
        <div className="mt-6 flex items-center gap-3 border border-border bg-secondary/40 p-5">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-signal" />
          <p className="text-sm text-muted-foreground">
            Nothing is overdue and nothing is due today. Send new requests or
            write, rather than re-checking this.
          </p>
        </div>
      ) : null}

      <Section
        title="Overdue follow-ups"
        tone="warn"
        rows={overdue}
        emptyLabel={null}
        busyId={busyId}
        pending={pending}
        action={{ label: "Log follow-up sent", type: "follow_up_sent" }}
        onAction={record}
      />

      <Section
        title="Due today"
        rows={dueToday}
        emptyLabel={null}
        busyId={busyId}
        pending={pending}
        action={{ label: "Log follow-up sent", type: "follow_up_sent" }}
        onAction={record}
      />

      <Section
        title="Check LinkedIn for acceptance"
        rows={awaitingAcceptance}
        emptyLabel={null}
        busyId={busyId}
        pending={pending}
        action={{ label: "Mark accepted", type: "connection_accepted" }}
        secondaryAction={{ label: "Still pending", type: null }}
        onAction={record}
      />

      <Section
        title="Accepted — first message not sent"
        rows={awaitingFirstMessage}
        emptyLabel={null}
        busyId={busyId}
        pending={pending}
        action={{ label: "Log first message sent", type: "first_message_sent" }}
        onAction={record}
      />

      <Section
        title="Replies to classify"
        rows={repliesToClassify}
        emptyLabel={null}
        busyId={busyId}
        pending={pending}
        action={{ label: "Mark qualified", type: "qualified" }}
        secondaryAction={{ label: "Disqualify", type: "disqualified" }}
        onAction={record}
      />

      <Section
        title="Field test before writing"
        rows={needFieldTest}
        emptyLabel={null}
        busyId={busyId}
        pending={pending}
        action={null}
        onAction={record}
      />

      {metricsDue.length > 0 ? (
        <section className="mt-9">
          <h2 className="text-sm font-semibold">Post metrics due for capture</h2>
          <ul className="mt-3 border border-border">
            {metricsDue.map((row) => (
              <li
                key={`${row.post.id}-${row.window}`}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {row.post.topic || row.post.hook || row.post.url}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {row.window} window · published{" "}
                    {row.post.publishedAt?.slice(0, 10) ?? "unknown"}
                  </p>
                </div>
                {row.post.url ? (
                  <a
                    href={row.post.url}
                    target="_blank"
                    rel="noopener"
                    className="focus-ring inline-flex items-center gap-2 rounded-sm text-xs font-semibold text-signal hover:text-foreground"
                  >
                    Open post
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Section({
  title,
  rows,
  tone = "neutral",
  busyId,
  pending,
  action,
  secondaryAction,
  onAction,
}: {
  title: string;
  rows: { account: Account; state: ReturnType<typeof deriveAccountState> }[];
  tone?: "neutral" | "warn";
  emptyLabel: string | null;
  busyId: string | null;
  pending: boolean;
  action: { label: string; type: SalesEventType } | null;
  secondaryAction?: { label: string; type: SalesEventType | null };
  onAction: (accountId: string, type: SalesEventType, rowId: string) => void;
}) {
  if (rows.length === 0) return null;

  return (
    <section className="mt-9">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <StatusBadge tone={tone === "warn" ? "warn" : "neutral"}>{rows.length}</StatusBadge>
      </div>

      <ul className="mt-3 border border-border">
        {rows.map(({ account, state }) => {
          const rowId = `${title}-${account.id}`;
          return (
            <li
              key={rowId}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{account.name}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {state.nextAction ?? "—"}
                  {state.nextActionDueAt ? (
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.12em]">
                      due {state.nextActionDueAt.slice(0, 10)}
                    </span>
                  ) : null}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {account.linkedinUrl ? (
                  <a
                    href={account.linkedinUrl}
                    target="_blank"
                    rel="noopener"
                    className="focus-ring inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    LinkedIn
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}

                {secondaryAction?.type ? (
                  <StudioButton
                    variant="secondary"
                    loading={pending && busyId === rowId}
                    onClick={() => onAction(account.id, secondaryAction.type!, rowId)}
                  >
                    {secondaryAction.label}
                  </StudioButton>
                ) : null}

                {action ? (
                  <StudioButton
                    loading={pending && busyId === rowId}
                    onClick={() => onAction(account.id, action.type, rowId)}
                  >
                    {action.label}
                  </StudioButton>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Which capture windows have come due and have no reading yet.
 *
 * A window opens once its age passes and stays open until a snapshot exists.
 * Missing a capture is recoverable; silently deciding the window closed is not,
 * because the number is then gone for good.
 */
function postsNeedingCapture(posts: ContentPost[], now: Date) {
  const windows: { window: "24h" | "7d" | "30d"; hours: number }[] = [
    { window: "24h", hours: 24 },
    { window: "7d", hours: 24 * 7 },
    { window: "30d", hours: 24 * 30 },
  ];

  return posts
    .filter((post) => post.status === "published" && post.publishedAt)
    .flatMap((post) => {
      const ageHours =
        (now.getTime() - new Date(post.publishedAt!).getTime()) / 3_600_000;
      return windows
        .filter((entry) => ageHours >= entry.hours)
        .map((entry) => ({ post, window: entry.window }));
    });
}

function isSameDay(a: Date, b: Date) {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

export { postsNeedingCapture };
