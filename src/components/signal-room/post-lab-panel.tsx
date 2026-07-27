"use client";

import {
  CheckCircle2,
  ClipboardCopy,
  FilePenLine,
  RefreshCw,
  Save,
  Sparkles,
} from "lucide-react";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { apiJson } from "@/lib/signal-room/client";
import type {
  Account,
  PostDraft,
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

const pillarPrompts: Record<PostPillar, { topic: string; pointOfView: string }> = {
  "Technical field note": {
    topic: "The production decision hidden inside a successful AI prototype",
    pointOfView:
      "Prototype success proves possibility, not operability; founders need explicit evaluation, fallback, cost, and ownership boundaries before scaling.",
  },
  "Startup strategy": {
    topic: "Why startup AI architecture is a sequencing problem before it is a tooling problem",
    pointOfView:
      "The highest-leverage architecture decision is often identifying what must be true now, what can wait, and which assumption deserves evidence first.",
  },
  "Operator story": {
    topic: "What working with early AI teams taught me about clarity",
    pointOfView:
      "Founders rarely need more options; they need a senior partner who can convert incomplete context into one executable production path without taking ownership away from the team.",
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
  const [topic, setTopic] = useState(pillarPrompts[recommendedPillar].topic);
  const [pointOfView, setPointOfView] = useState(pillarPrompts[recommendedPillar].pointOfView);
  const [sourceMaterial, setSourceMaterial] = useState("");
  const [accountId, setAccountId] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function changePillar(next: PostPillar) {
    setPillar(next);
    setTopic(pillarPrompts[next].topic);
    setPointOfView(pillarPrompts[next].pointOfView);
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
            pointOfView,
            sourceMaterial,
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
      <form onSubmit={submit} className="mt-5 space-y-5">
        <Field label="Authority pillar">
          <StudioSelect value={pillar} onChange={(event) => changePillar(event.target.value as PostPillar)}>
            <option>Technical field note</option><option>Startup strategy</option><option>Operator story</option>
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
        {error ? <p className="text-xs leading-5 text-destructive" role="alert">{error}</p> : null}
        <StudioButton type="submit" loading={isPending} className="w-full">
          <RefreshCw className="h-4 w-4" />
          Generate substantive post
        </StudioButton>
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
  const checks = getMeatChecks(draft, post);

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
          <p className="consulting-kicker text-signal">{post.pillar}</p>
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
        <h2 className="text-sm font-semibold">Meat check</h2>
        <div className="mt-3 grid gap-px bg-border sm:grid-cols-2">
          {checks.map((check) => (
            <div key={check.label} className="flex gap-3 bg-card p-4">
              <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${check.pass ? "text-signal" : "text-brass"}`} />
              <div><p className="text-xs font-semibold">{check.label}</p><p className="mt-1 text-[11px] leading-5 text-muted-foreground">{check.detail}</p></div>
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

function Quality({ label, value }: { label: string; value: number }) {
  return <div className="bg-card p-4"><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="consulting-display mt-3 text-2xl">{value}</p></div>;
}

function getMeatChecks(draft: string, post: PostDraft) {
  const paragraphs = draft.split(/\n\s*\n/).filter((item) => item.trim().length > 0);
  const numberedDecisions = draft.match(/^\s*\d+[.)]\s/gm)?.length ?? 0;
  const genericPhrases = ["ai is changing everything", "the future is here", "game changer", "revolutionize your business"];
  return [
    { label: "One substantial argument", pass: draft.length >= 1200, detail: draft.length >= 1200 ? "Enough room to develop the claim." : "Develop the reasoning beyond a short take." },
    { label: "Concrete operating detail", pass: numberedDecisions >= 3 || paragraphs.length >= 8, detail: `${numberedDecisions} numbered decisions · ${paragraphs.length} paragraphs.` },
    { label: "Credible claims", pass: post.evidence.length > 0 || post.pillar === "Operator story", detail: post.evidence.length > 0 ? `${post.evidence.length} sourced claims attached.` : "Keep this explicitly experience-based." },
    { label: "No empty AI hype", pass: !genericPhrases.some((phrase) => draft.toLowerCase().includes(phrase)), detail: "Checks common generic phrases before publishing." },
  ];
}

function findRecommendedPillar(posts: PostDraft[]): PostPillar {
  const pillars: PostPillar[] = ["Technical field note", "Startup strategy", "Operator story"];
  return pillars.toSorted(
    (a, b) => posts.filter((post) => post.pillar === a).length - posts.filter((post) => post.pillar === b).length
  )[0];
}