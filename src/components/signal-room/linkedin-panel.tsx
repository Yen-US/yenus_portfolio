"use client";

import { useState, useTransition } from "react";
import { ExternalLink, ShieldAlert } from "lucide-react";
import type {
  ContentMetricSnapshot,
  ContentPost,
  ProfileVersion,
  ProviderCapability,
} from "@/lib/signal-room/types";
import { apiJson } from "@/lib/signal-room/client";
import {
  CopyButton,
  Field,
  PanelHeading,
  StatusBadge,
  StudioButton,
  StudioInput,
  StudioSelect,
} from "@/components/signal-room/ui";

/**
 * LinkedIn workspace: what the platform will not tell us, recorded by hand.
 *
 * Three jobs — register a published post, capture its metrics at each window,
 * and track which profile headline was live when. All manual by design: post
 * and reaction reads returned 403/404 for personal accounts, so the honest
 * options are manual entry or a dashboard of invented numbers.
 */
export function LinkedInPanel({
  posts,
  metrics,
  profiles,
  capabilities,
  onPostsChanged,
  onMetricsChanged,
  onProfilesChanged,
}: {
  posts: ContentPost[];
  metrics: ContentMetricSnapshot[];
  profiles: ProfileVersion[];
  capabilities: ProviderCapability[];
  onPostsChanged: (post: ContentPost) => void;
  onMetricsChanged: (snapshot: ContentMetricSnapshot) => void;
  onProfilesChanged: (version: ProfileVersion) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <PanelHeading
        eyebrow="LinkedIn"
        title="The channel does not report. We do."
      />

      {error ? (
        <p
          className="mt-5 border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <CapabilityNotice capabilities={capabilities} />
      <RegisterPost onDone={onPostsChanged} onError={setError} />
      <PostRegistry
        posts={posts}
        metrics={metrics}
        onCaptured={onMetricsChanged}
        onError={setError}
      />
      <ProfileVersions
        profiles={profiles}
        onCreated={onProfilesChanged}
        onError={setError}
      />
    </div>
  );
}

/**
 * What the provider actually allows.
 *
 * Shown so a manual-entry form reads as a considered decision rather than a
 * missing feature. A 403 is displayed as forbidden — never folded into a zero.
 */
function CapabilityNotice({ capabilities }: { capabilities: ProviderCapability[] }) {
  const known = capabilities.length > 0 ? capabilities : null;

  return (
    <section className="mt-7 border border-brass/30 bg-brass/5 p-5">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
        <div>
          <p className="text-sm font-semibold">Why these numbers are typed in by hand</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Authenticated reads of personal posts and their reactions returned
            403/404 when last tested. Those are refusals, not zeroes, so a blank
            metric field below stays unavailable rather than being recorded as 0.
          </p>
          {known ? (
            <ul className="mt-4 space-y-1.5">
              {known.map((capability) => (
                <li key={capability.id} className="flex items-center gap-3 text-xs">
                  <StatusBadge
                    tone={capability.state === "available" ? "good" : "warn"}
                  >
                    {capability.state}
                  </StatusBadge>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {capability.capability}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function RegisterPost({
  onDone,
  onError,
}: {
  onDone: (post: ContentPost) => void;
  onError: (message: string | null) => void;
}) {
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<ContentPost["contentType"]>("measured_test");
  const [ctaType, setCtaType] = useState<ContentPost["ctaType"]>("question");
  const [publishedAt, setPublishedAt] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!url.trim()) {
      onError("A post URL is required to register it.");
      return;
    }
    onError(null);
    startTransition(async () => {
      try {
        const { post } = await apiJson<{ post: ContentPost }>(
          "/api/signal-room/content-posts",
          {
            method: "POST",
            body: JSON.stringify({
              url: url.trim(),
              topic: topic.trim(),
              contentType,
              ctaType,
              offerMentioned: ctaType === "offer",
              status: "published",
              publishedAt: publishedAt
                ? new Date(publishedAt).toISOString()
                : new Date().toISOString(),
            }),
          }
        );
        onDone(post);
        setUrl("");
        setTopic("");
        setPublishedAt("");
      } catch (requestError) {
        onError(
          requestError instanceof Error ? requestError.message : "Could not register."
        );
      }
    });
  }

  return (
    <section className="mt-9">
      <h2 className="text-sm font-semibold">Register a published post</h2>
      <div className="mt-3 grid gap-4 border border-border p-5 sm:grid-cols-2">
        <Field label="Post URL">
          <StudioInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.linkedin.com/posts/..."
          />
        </Field>
        <Field label="Topic">
          <StudioInput value={topic} onChange={(e) => setTopic(e.target.value)} />
        </Field>
        <Field label="Content type">
          <StudioSelect
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentPost["contentType"])}
          >
            <option value="measured_test">Measured test</option>
            <option value="decision_framework">Decision framework</option>
            <option value="operator_story">Operator story</option>
            <option value="offer">Offer</option>
          </StudioSelect>
        </Field>
        <Field label="Closing CTA">
          <StudioSelect
            value={ctaType}
            onChange={(e) => setCtaType(e.target.value as ContentPost["ctaType"])}
          >
            <option value="question">Question</option>
            <option value="discussion">Discussion</option>
            <option value="save">Save</option>
            <option value="offer">Offer</option>
            <option value="none">None</option>
          </StudioSelect>
        </Field>
        <Field label="Published at" hint="Sets the 24h / 7d / 30d capture windows.">
          <StudioInput
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </Field>
        <div className="flex items-end">
          <StudioButton loading={pending} onClick={submit}>
            Register post
          </StudioButton>
        </div>
      </div>
    </section>
  );
}

function PostRegistry({
  posts,
  metrics,
  onCaptured,
  onError,
}: {
  posts: ContentPost[];
  metrics: ContentMetricSnapshot[];
  onCaptured: (snapshot: ContentMetricSnapshot) => void;
  onError: (message: string | null) => void;
}) {
  if (posts.length === 0) {
    return (
      <section className="mt-9">
        <h2 className="text-sm font-semibold">Post registry</h2>
        <p className="mt-3 border border-border bg-secondary/40 p-4 text-xs leading-5 text-muted-foreground">
          No posts registered yet. Register one above and its capture windows
          appear in Today as they come due.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-9">
      <h2 className="text-sm font-semibold">Post registry</h2>
      <div className="mt-3 space-y-4">
        {posts.map((post) => (
          <PostRow
            key={post.id}
            post={post}
            snapshots={metrics.filter((metric) => metric.postId === post.id)}
            onCaptured={onCaptured}
            onError={onError}
          />
        ))}
      </div>
    </section>
  );
}

const METRIC_FIELDS = [
  ["impressions", "Impressions"],
  ["reactions", "Reactions"],
  ["comments", "Comments"],
  ["reposts", "Reposts"],
  ["profileViews", "Profile views"],
  ["inboundMessages", "Inbound DMs"],
] as const;

function PostRow({
  post,
  snapshots,
  onCaptured,
  onError,
}: {
  post: ContentPost;
  snapshots: ContentMetricSnapshot[];
  onCaptured: (snapshot: ContentMetricSnapshot) => void;
  onError: (message: string | null) => void;
}) {
  const [window, setWindow] = useState<ContentMetricSnapshot["window"]>("24h");
  const [values, setValues] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function capture() {
    onError(null);
    startTransition(async () => {
      try {
        // Empty string means "not supplied" and is sent as null. Only a typed
        // 0 becomes a recorded zero — the distinction this whole panel rests on.
        const payload: Record<string, unknown> = { postId: post.id, window, source: "manual" };
        for (const [key] of METRIC_FIELDS) {
          const raw = values[key];
          payload[key] = raw === undefined || raw.trim() === "" ? null : Number(raw);
        }
        const { snapshot } = await apiJson<{ snapshot: ContentMetricSnapshot }>(
          "/api/signal-room/content-metrics",
          { method: "POST", body: JSON.stringify(payload) }
        );
        onCaptured(snapshot);
        setValues({});
      } catch (requestError) {
        onError(
          requestError instanceof Error ? requestError.message : "Could not save metrics."
        );
      }
    });
  }

  return (
    <article className="border border-border p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {post.topic || post.hook || post.url}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {post.contentType.replace(/_/g, " ")} · {post.ctaType} ·{" "}
            {post.publishedAt?.slice(0, 10) ?? "unpublished"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {post.url ? (
            <a
              href={post.url}
              target="_blank"
              rel="noopener"
              className="focus-ring inline-flex items-center gap-1.5 rounded-sm text-xs font-semibold text-signal hover:text-foreground"
            >
              Open
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          <CopyButton text={post.url} label="URL" />
        </div>
      </div>

      {snapshots.length > 0 ? (
        <ul className="mt-4 border-t border-border pt-3">
          {snapshots.map((snapshot) => (
            <li key={snapshot.id} className="py-1 font-mono text-[11px] text-muted-foreground">
              {snapshot.window}: {formatSnapshot(snapshot)}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-4">
        <Field label="Window">
          <StudioSelect
            value={window}
            onChange={(e) => setWindow(e.target.value as ContentMetricSnapshot["window"])}
          >
            <option value="24h">24 hours</option>
            <option value="7d">7 days</option>
            <option value="30d">30 days</option>
            <option value="custom">Custom</option>
          </StudioSelect>
        </Field>
        {METRIC_FIELDS.map(([key, label]) => (
          <Field key={key} label={label} hint="Blank = unavailable">
            <StudioInput
              type="number"
              min={0}
              value={values[key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            />
          </Field>
        ))}
      </div>

      <StudioButton className="mt-4" loading={pending} onClick={capture}>
        Save snapshot
      </StudioButton>
    </article>
  );
}

/** Renders null as "unavailable", never as 0. */
function formatSnapshot(snapshot: ContentMetricSnapshot) {
  return METRIC_FIELDS.map(([key, label]) => {
    const value = snapshot[key];
    return `${label} ${value === null ? "unavailable" : value}`;
  }).join(" · ");
}

function ProfileVersions({
  profiles,
  onCreated,
  onError,
}: {
  profiles: ProfileVersion[];
  onCreated: (version: ProfileVersion) => void;
  onError: (message: string | null) => void;
}) {
  const [headline, setHeadline] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [pending, startTransition] = useTransition();

  /**
   * The candidate headline. Written to describe the buyer's problem rather than
   * the job title, and phrased so the Accenture → Microsoft for Startups
   * relationship stays accurate.
   */
  const candidate =
    "AI Architecture Advisor for Funded Startups | Inference Cost, Latency & Provider Risk | Senior AI Solution Architect supporting Microsoft for Startups via Accenture";

  function create(text: string) {
    onError(null);
    startTransition(async () => {
      try {
        const { version } = await apiJson<{ version: ProfileVersion }>(
          "/api/signal-room/profile-versions",
          { method: "POST", body: JSON.stringify({ headline: text, hypothesis }) }
        );
        onCreated(version);
        setHeadline("");
        setHypothesis("");
      } catch (requestError) {
        onError(
          requestError instanceof Error ? requestError.message : "Could not save."
        );
      }
    });
  }

  return (
    <section className="mt-9">
      <h2 className="text-sm font-semibold">Profile versions</h2>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        Recorded here, changed by hand on LinkedIn. Tracking when each headline
        was live is what lets acceptance rate be read against it later.
      </p>

      <div className="mt-4 border border-border p-5">
        <p className="consulting-kicker text-signal">Candidate</p>
        <p className="mt-3 text-sm leading-6">{candidate}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton text={candidate} label="Copy headline" />
          <StudioButton variant="secondary" loading={pending} onClick={() => create(candidate)}>
            Record as a version
          </StudioButton>
        </div>
      </div>

      <div className="mt-4 grid gap-4 border border-border p-5">
        <Field label="Or write your own">
          <StudioInput
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Headline text"
          />
        </Field>
        <Field label="Hypothesis" hint="What you expect this wording to change.">
          <StudioInput
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
          />
        </Field>
        <div>
          <StudioButton
            loading={pending}
            disabled={!headline.trim()}
            onClick={() => create(headline.trim())}
          >
            Save version
          </StudioButton>
        </div>
      </div>

      {profiles.length > 0 ? (
        <ul className="mt-4 border border-border">
          {profiles.map((profile) => (
            <li key={profile.id} className="border-b border-border px-4 py-3 last:border-b-0">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs leading-5">{profile.headline}</p>
                {profile.isActive ? <StatusBadge tone="good">Live</StatusBadge> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
