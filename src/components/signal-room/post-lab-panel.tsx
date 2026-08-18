"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCopy,
  Download,
  FilePenLine,
  Image as ImageIcon,
  RefreshCw,
  Save,
  Sparkles,
  Wand2,
} from "lucide-react";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { apiJson } from "@/lib/signal-room/client";
import { POST_FORMATS, getRubricChecks, summariseRubric } from "@/lib/signal-room/post-craft";
import type {
  Account,
  PostDraft,
  PostFormat,
  PostPillar,
  PostStatus,
} from "@/lib/signal-room/types";
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

interface GeneratedImage {
  dataUrl: string;
  prompt: string;
  model: string;
  bytes: number;
}

interface AutopilotBrief {
  topic: string;
  pillar: PostPillar;
  format: PostFormat;
  pointOfView: string;
  reasoning: string;
  rejected: string[];
  accountIds: string[];
}

const pillarPrompts: Record<PostPillar, { topic: string; pointOfView: string; format: PostFormat }> = {
  "Technical field note": {
    topic: "The production decision hidden inside a successful AI prototype",
    pointOfView:
      "Prototype success proves possibility, not operability; founders need explicit evaluation, fallback, cost, and ownership boundaries before scaling.",
    format: "Recognition patterns",
  },
  "Startup strategy": {
    topic: "Why startup AI architecture is a sequencing problem before it is a tooling problem",
    pointOfView:
      "The highest-leverage architecture decision is often identifying what must be true now, what can wait, and which assumption deserves evidence first.",
    format: "Single argument",
  },
  "Operator story": {
    topic: "What working with early AI teams taught me about clarity",
    pointOfView:
      "Founders rarely need more options; they need a senior partner who can convert incomplete context into one executable production path without taking ownership away from the team.",
    format: "Field note",
  },
};

export function PostLabPanel({
  accounts,
  posts,
  mode,
  onPostsChange,
}: {
  accounts: Account[];
  posts: PostDraft[];
  mode: "supabase" | "demo";
  onPostsChange: (posts: PostDraft[]) => void;
}) {
  const recommendedPillar = findRecommendedPillar(posts);
  const [selectedId, setSelectedId] = useState(posts[0]?.id ?? "");
  const selected = posts.find((post) => post.id === selectedId) ?? posts[0] ?? null;

  useEffect(() => {
    if (!selectedId && posts[0]) setSelectedId(posts[0].id);
  }, [posts, selectedId]);

  function upsertPost(post: PostDraft) {
    onPostsChange(
      posts.some((item) => item.id === post.id)
        ? posts.map((item) => (item.id === post.id ? post : item))
        : [post, ...posts]
    );
    setSelectedId(post.id);
  }

  return (
    <div>
      <PanelHeading
        eyebrow="LinkedIn authority"
        title="Post Lab"
        action={<StatusBadge tone="good">Next: {recommendedPillar}</StatusBadge>}
      />

      <div className="mt-7 grid gap-7 2xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <aside className="2xl:sticky 2xl:top-24 2xl:self-start">
          <div className="border-t border-foreground">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelectedId(post.id)}
                className={`focus-ring w-full border-b border-border px-3 py-4 text-left transition-colors ${
                  selected?.id === post.id ? "bg-secondary" : "hover:bg-secondary/50"
                }`}
              >
                <p className="line-clamp-2 text-sm font-semibold leading-5">{post.title}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge tone={post.status === "ready" ? "good" : "neutral"}>{post.status}</StatusBadge>
                  <span className="text-[10px] text-muted-foreground">{post.pillar}</span>
                </div>
              </button>
            ))}
            {posts.length === 0 ? (
              <p className="border-b border-border px-3 py-8 text-sm text-muted-foreground">No drafts yet.</p>
            ) : null}
          </div>

          <div className="mt-7 border-t border-foreground pt-4">
            <p className="consulting-kicker text-signal">Rotation</p>
            {(["Technical field note", "Startup strategy", "Operator story"] as PostPillar[]).map((pillar) => (
              <div key={pillar} className="flex items-center justify-between border-b border-border py-3 text-xs">
                <span>{pillar}</span>
                <span className="font-mono text-muted-foreground">{posts.filter((post) => post.pillar === pillar).length}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="min-w-0">
          {selected ? (
            <PostEditor key={selected.id} post={selected} mode={mode} onChange={upsertPost} />
          ) : (
            <div className="grid min-h-96 place-items-center border border-dashed border-border text-center">
              <div><FilePenLine className="mx-auto h-6 w-6 text-signal" /><p className="mt-4 text-sm font-semibold">Generate the first substantive draft</p></div>
            </div>
          )}
        </main>

        <PostGenerator
          accounts={accounts}
          mode={mode}
          recommendedPillar={recommendedPillar}
          onGenerated={upsertPost}
        />
      </div>
    </div>
  );
}

function PostGenerator({
  accounts,
  mode,
  recommendedPillar,
  onGenerated,
}: {
  accounts: Account[];
  mode: "supabase" | "demo";
  recommendedPillar: PostPillar;
  onGenerated: (post: PostDraft) => void;
}) {
  const [pillar, setPillar] = useState<PostPillar>(recommendedPillar);
  const [format, setFormat] = useState<PostFormat>(pillarPrompts[recommendedPillar].format);
  const [topic, setTopic] = useState(pillarPrompts[recommendedPillar].topic);
  const [pointOfView, setPointOfView] = useState(pillarPrompts[recommendedPillar].pointOfView);
  const [sourceMaterial, setSourceMaterial] = useState("");
  const [exemplar, setExemplar] = useState("");
  const [accountId, setAccountId] = useState("");
  const [error, setError] = useState("");
  const [brief, setBrief] = useState<AutopilotBrief | null>(null);
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [imageNote, setImageNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isAutopilot, startAutopilot] = useTransition();

  const formatSpec = POST_FORMATS.find((spec) => spec.id === format) ?? POST_FORMATS[0];
  const busy = isPending || isAutopilot;

  function changePillar(next: PostPillar) {
    setPillar(next);
    setTopic(pillarPrompts[next].topic);
    setPointOfView(pillarPrompts[next].pointOfView);
    setFormat(pillarPrompts[next].format);
  }

  function useAccountEvidence(nextAccountId: string) {
    setAccountId(nextAccountId);
    const account = accounts.find((item) => item.id === nextAccountId);
    if (!account?.brief) return;
    setSourceMaterial(
      [
        `Account: ${account.name}`,
        `Summary: ${account.brief.summary}`,
        "Verified evidence:",
        ...account.brief.evidence.map((item) => `- ${item.claim} | ${item.sourceTitle} | ${item.sourceUrl}`),
        "Architecture hypotheses (do not present as facts):",
        ...account.brief.architectureHypotheses.map((item) => `- ${item.hypothesis} | Signal: ${item.evidence}`),
        "Uncertainties:",
        ...account.brief.uncertainties.map((item) => `- ${item}`),
      ].join("\n")
    );
  }

  /**
   * Magic button: no operator input at all. The route plans the brief from the
   * workspace, then runs the same four passes. The returned brief is shown so
   * the choice of subject is reviewable rather than opaque, and it back-fills
   * the form so the next run can be a manual edit of what it chose.
   */
  function runAutopilot() {
    setError("");
    setBrief(null);
    setImage(null);
    setImageNote("");
    startAutopilot(async () => {
      try {
        const result = await apiJson<{
          post: PostDraft;
          brief: AutopilotBrief | null;
          image: GeneratedImage | null;
          imageError: string | null;
        }>("/api/signal-room/generate-post", {
          method: "POST",
          body: JSON.stringify({ autopilot: true, persist: mode === "supabase" }),
        });
        setImage(result.image);
        // The draft still succeeded; the diagram is a bonus, so this is a note
        // rather than an error banner.
        if (result.imageError) setImageNote(result.imageError);
        if (result.brief) {
          setBrief(result.brief);
          setPillar(result.brief.pillar);
          setFormat(result.brief.format);
          setTopic(result.brief.topic);
          setPointOfView(result.brief.pointOfView);
        }
        const now = new Date().toISOString();
        onGenerated(
          mode === "supabase"
            ? result.post
            : { ...result.post, id: `demo-${crypto.randomUUID()}`, createdAt: now, updatedAt: now }
        );
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Autopilot failed.");
      }
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        const result = await apiJson<{ post: PostDraft }>("/api/signal-room/generate-post", {
          method: "POST",
          body: JSON.stringify({
            topic,
            pillar,
            format,
            pointOfView,
            sourceMaterial,
            exemplar: exemplar.trim() || undefined,
            accountIds: accountId ? [accountId] : [],
            persist: mode === "supabase",
          }),
        });
        const now = new Date().toISOString();
        onGenerated(
          mode === "supabase"
            ? result.post
            : { ...result.post, id: `demo-${crypto.randomUUID()}`, createdAt: now, updatedAt: now }
        );
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Generation failed.");
      }
    });
  }

  return (
    <aside className="border border-border bg-card p-5 2xl:sticky 2xl:top-24 2xl:self-start">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Sparkles className="h-4 w-4 text-signal" />
        <h2 className="text-sm font-semibold">Generate a draft</h2>
      </div>

      <div className="mt-5 border border-signal/30 bg-signal/5 p-4">
        <StudioButton type="button" onClick={runAutopilot} loading={isAutopilot} disabled={busy} className="w-full">
          <Wand2 className="h-4 w-4" />
          {isAutopilot ? "Choosing a subject" : "Write this week's post"}
        </StudioButton>
        <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
          No input needed. Picks the pillar by rotation, reads your account briefs for
          evidence, avoids what you have already argued, then runs all four passes.
        </p>
        {brief ? (
          <div className="mt-4 border-t border-signal/20 pt-3">
            <p className="consulting-kicker text-signal">Why this subject</p>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{brief.reasoning}</p>
            {brief.rejected.length > 0 ? (
              <>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  Angles it passed over
                </p>
                <ul className="mt-1 space-y-1">
                  {brief.rejected.map((item, index) => (
                    <li key={index} className="text-[11px] leading-5 text-muted-foreground">- {item}</li>
                  ))}
                </ul>
              </>
            ) : null}
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
              Its choices are loaded below. Edit and regenerate if you disagree.
            </p>
          </div>
        ) : null}

        {image ? (
          <div className="mt-4 border-t border-signal/20 pt-3">
            <p className="consulting-kicker text-signal">Diagram</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL, never optimised */}
            <img
              src={image.dataUrl}
              alt="Generated diagram for this post"
              className="mt-2 w-full border border-border"
            />
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
              {image.model} · {Math.round(image.bytes / 1024).toLocaleString()} KB
            </p>
            <a
              href={image.dataUrl}
              download="post-diagram.png"
              className="focus-ring mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-sm border border-border bg-background px-4 text-sm font-semibold transition-colors hover:border-foreground"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </a>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
              Read every word in the image before posting. Generators mangle text, and a
              mislabelled diagram in a post about measurement rigour is the worst failure.
            </p>
          </div>
        ) : null}

        {imageNote ? (
          <p className="mt-3 text-[11px] leading-5 text-brass">
            Draft succeeded, diagram did not: {imageNote} The prompt is in the publishing
            package, so you can run it by hand.
          </p>
        ) : null}
      </div>

      <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        Or brief it yourself
      </p>

      <form onSubmit={submit} className="mt-4 space-y-5">
        <Field label="Authority pillar">
          <StudioSelect value={pillar} onChange={(event) => changePillar(event.target.value as PostPillar)}>
            <option>Technical field note</option><option>Startup strategy</option><option>Operator story</option>
          </StudioSelect>
        </Field>
        <Field label="Structure" hint={formatSpec.summary}>
          <StudioSelect value={format} onChange={(event) => setFormat(event.target.value as PostFormat)}>
            {POST_FORMATS.map((spec) => <option key={spec.id} value={spec.id}>{spec.label}</option>)}
          </StudioSelect>
        </Field>
        <Field label="Topic"><StudioInput value={topic} onChange={(event) => setTopic(event.target.value)} required /></Field>
        <Field label="Point of view" hint="The non-obvious claim the post must defend.">
          <StudioTextarea value={pointOfView} onChange={(event) => setPointOfView(event.target.value)} className="min-h-32" required />
        </Field>
        <Field label="Use account evidence">
          <StudioSelect value={accountId} onChange={(event) => useAccountEvidence(event.target.value)}>
            <option value="">No account selected</option>
            {accounts.filter((account) => account.brief).map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
          </StudioSelect>
        </Field>
        <Field label="Field notes and source material" hint="Only supplied evidence may become a factual claim.">
          <StudioTextarea value={sourceMaterial} onChange={(event) => setSourceMaterial(event.target.value)} className="min-h-48 text-xs" />
        </Field>
        <Field label="Structural exemplar" hint="Optional. Paste a past post to match its architecture, never its subject.">
          <StudioTextarea value={exemplar} onChange={(event) => setExemplar(event.target.value)} className="min-h-24 text-xs" />
        </Field>
        {error ? <p className="text-xs leading-5 text-destructive" role="alert">{error}</p> : null}
        <StudioButton type="submit" loading={isPending} disabled={busy} className="w-full">
          <RefreshCw className="h-4 w-4" />
          {isPending ? "Angle, draft, critique, revise" : "Generate substantive post"}
        </StudioButton>
        <p className="text-[11px] leading-5 text-muted-foreground">
          Four passes. Takes a couple of minutes, and the critique pass is what closes the gap to a publishable draft.
        </p>
      </form>
    </aside>
  );
}

function PostEditor({ post, mode, onChange }: { post: PostDraft; mode: "supabase" | "demo"; onChange: (post: PostDraft) => void }) {
  const [title, setTitle] = useState(post.title);
  const [draft, setDraft] = useState(post.draft);
  const [status, setStatus] = useState<PostStatus>(post.status);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const checks = getRubricChecks(draft, post);
  const summary = summariseRubric(checks);

  function save() {
    setError("");
    startTransition(async () => {
      const next = { ...post, title, draft, status, updatedAt: new Date().toISOString() };
      try {
        if (mode === "supabase") {
          const result = await apiJson<{ post: PostDraft }>("/api/signal-room/posts", {
            method: "PATCH",
            body: JSON.stringify({ id: post.id, title, draft, status }),
          });
          onChange(result.post);
        } else {
          onChange(next);
        }
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Save failed.");
      }
    });
  }

  return (
    <article>
      <div className="flex flex-col gap-4 border-b border-foreground pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="consulting-kicker text-signal">{post.pillar} · {post.format ?? "Recognition patterns"}</p>
          <StudioInput value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 border-0 bg-transparent px-0 font-serif text-xl font-semibold shadow-none focus-visible:ring-0" aria-label="Post title" />
        </div>
        <div className="flex items-center gap-2">
          <StudioSelect value={status} onChange={(event) => setStatus(event.target.value as PostStatus)} className="w-28">
            <option>idea</option><option>draft</option><option>ready</option><option>published</option>
          </StudioSelect>
          <CopyButton text={draft} label="Copy post" />
        </div>
      </div>

      <StudioTextarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="mt-6 min-h-[640px] border-0 bg-card p-6 text-[15px] leading-7 shadow-none focus-visible:ring-1"
        aria-label="LinkedIn post draft"
      />

      <div className="mt-4 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[10px] text-muted-foreground">{draft.length.toLocaleString()} characters · {draft.trim().split(/\s+/).filter(Boolean).length} words</p>
        <StudioButton variant="secondary" onClick={save} loading={isPending}>
          <Save className="h-4 w-4" />Save draft
        </StudioButton>
      </div>
      {error ? <p className="mt-4 text-xs text-destructive" role="alert">{error}</p> : null}

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Rubric</h2>
          <StatusBadge tone={summary.ready ? "good" : "warn"}>
            {summary.passed}/{summary.total} passing
            {summary.blocking > 0 ? ` · ${summary.blocking} blocking` : ""}
          </StatusBadge>
        </div>
        <div className="mt-3 grid gap-px bg-border sm:grid-cols-2">
          {checks.map((check) => (
            <div key={check.id} className="flex gap-3 bg-card p-4">
              {check.passed ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
              ) : (
                <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${check.severity === "block" ? "text-destructive" : "text-brass"}`} />
              )}
              <div>
                <p className="text-xs font-semibold">{check.label}</p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{check.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {post.quality ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold">Model critique</h2>
          <div className="mt-3 grid gap-px bg-border sm:grid-cols-4">
            <Quality label="Specificity" value={post.quality.specificity} />
            <Quality label="Practical value" value={post.quality.practicalValue} />
            <Quality label="Credibility" value={post.quality.credibility} />
            <Quality label="Readability" value={post.quality.readability} />
          </div>
          {post.quality.notes.map((note) => <p key={note} className="border-b border-border py-3 text-xs leading-5 text-muted-foreground">{note}</p>)}
        </section>
      ) : null}

      {post.critique ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold">Adversarial pass</h2>
          <p className="mt-3 border-b border-border pb-3 text-xs leading-5">
            <span className="font-semibold">Weakest section. </span>
            {post.critique.weakestSection}
          </p>
          <ListBlock label="Cut candidates" items={post.critique.cutCandidates} />
          <ListBlock label="Unsupported claims" items={post.critique.unsupportedClaims} />
          <ListBlock label="Revisions applied" items={post.critique.revisionsApplied} />
        </section>
      ) : null}

      {post.artifacts ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold">Publishing package</h2>

          {post.artifacts.image ? (
            <div className="mt-3 border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-signal" />
                <p className="text-xs font-semibold">{post.artifacts.image.concept}</p>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{post.artifacts.image.whyThisOne}</p>
              <p className="mt-3 border-l-2 border-signal/40 pl-3 text-[11px] leading-5">{post.artifacts.image.prompt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <CopyButton text={post.artifacts.image.prompt} label="Copy prompt" />
                <CopyButton text={post.artifacts.image.alternate} label="Copy alternate" />
              </div>
            </div>
          ) : null}

          <ListBlock label="Why it is built this way" items={post.artifacts.rationale} />
          <ListBlock label="CTA variants" items={post.artifacts.ctaVariants} copyable />
          <ListBlock label="Defence notes" items={post.artifacts.defenceNotes} />
          <ListBlock label="Ship checklist" items={post.artifacts.shipChecklist} checklist />
        </section>
      ) : null}

      <section className="mt-8">
        <div className="flex items-center gap-2"><ClipboardCopy className="h-4 w-4 text-signal" /><h2 className="text-sm font-semibold">Claim ledger</h2></div>
        {post.evidence.length > 0 ? post.evidence.map((item) => (
          <div key={`${item.claim}-${item.sourceUrl}`} className="border-b border-border py-4">
            <p className="text-xs leading-5">{item.claim}</p>
            <a href={item.sourceUrl} target="_blank" rel="noopener" className="mt-2 block text-[11px] text-signal hover:underline">{item.sourceTitle}</a>
          </div>
        )) : <p className="mt-3 text-xs leading-5 text-muted-foreground">Experience-based framework. No external factual claims attached.</p>}
      </section>
    </article>
  );
}

function ListBlock({
  label,
  items,
  copyable = false,
  checklist = false,
}: {
  label: string;
  items: string[];
  copyable?: boolean;
  checklist?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-5">
      <p className="consulting-kicker text-signal">{label}</p>
      {items.map((item, index) => (
        <div key={`${label}-${index}`} className="flex items-start gap-3 border-b border-border py-3">
          {checklist ? <span className="mt-0.5 h-3 w-3 shrink-0 border border-border" aria-hidden /> : null}
          <p className="flex-1 text-[11px] leading-5 text-muted-foreground">{item}</p>
          {copyable ? <CopyButton text={item} label="Copy" /> : null}
        </div>
      ))}
    </div>
  );
}

function Quality({ label, value }: { label: string; value: number }) {
  return <div className="bg-card p-4"><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="consulting-display mt-3 text-2xl">{value}</p></div>;
}

function findRecommendedPillar(posts: PostDraft[]): PostPillar {
  const pillars: PostPillar[] = ["Technical field note", "Startup strategy", "Operator story"];
  return pillars.toSorted(
    (a, b) => posts.filter((post) => post.pillar === a).length - posts.filter((post) => post.pillar === b).length
  )[0];
}
