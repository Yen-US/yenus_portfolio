---
title: Facet-Enriched RAG — Field Test Plan
status: proposed
created: 2026-09-21
owner: Yenson Umaña
depends_on: A corpus you know well enough to write ground truth for
constraint: One state per request — no per-span answers. Chunk facets cost one request each.
blocks: The fourth post in the Jev series (the measured one)
---

# Facet-Enriched RAG

*A test plan, an architecture, and the exact data to collect before claiming any of it publicly.*

The premise: TypeSafe's Jev makes per-passage judgment cheap enough to run at **ingestion time over a whole corpus**, not just at query time over retrieved candidates. That is a genuinely new affordance. Whether it improves retrieval is an open question, and this document exists to answer it with numbers instead of reasoning.

---

## 1. Why this is worth testing

Two techniques are on the table. They fail in **opposite directions**, which is the entire reason to test them together rather than pick one.

| | Query-time scoring (the cookbook) | Index-time facets (the new idea) |
|---|---|---|
| When exclusion happens | After retrieval | Before retrieval |
| Can it recover what retrieval missed? | **No** | **Yes** |
| A wrong call affects | One request | Every query, permanently |
| Wrongness is visible as | A passage scored low | A chunk that simply is not there |
| Adapts to new query patterns | Free | Requires re-index |

The cookbook's own stated limitation is that it "cannot recover documents retrieval missed." Index-time facets are the only thing on this list that addresses that. That is the complementarity worth proving.

The risk runs the other way: index-time misclassification is **systematic and silent**. A mislabelled chunk does not rank poorly — it becomes unreachable, identically, for every query that does not match its label. No downstream step recovers it. This is the failure mode the test must be designed to catch, because it will not show up in a normal eval.

---

## 2. Architecture

### 2.1 Ingestion — two tiers

A single pass at one granularity does not work, and the reason is a hard API constraint rather than a preference.

**The constraint:** each request evaluates one state against one or more questions, and all questions see the same state. State can hold an array, but questions cannot be scoped to individual elements, and Noul returns one probability for the whole state. There is no per-span answer. Chunk-level facets therefore require one request per chunk — this is structural, not an optimisation to be found later.

**Why not document-only:** you retrieve chunks, not documents. Label a 54k-char runbook `topic=auth` and chunk 19 — the billing digression, the appendix — inherits a label that is wrong for it. Document facets are only as good as document homogeneity, and they are least homogeneous in exactly the long references where retrieval matters most. This is the same silent systematic failure as §1, arriving through a different door.

**Why not chunk-only:** a chunk torn from position 14 of 27 often cannot answer the question. "Does this assume prior context" is unanswerable in isolation. "Is this an exception to a rule" needs the rule, three chunks up. Judging those per-chunk produces confident labels derived from insufficient information, which is worse than no labels.

```text
Document
    ↓ one request: document in state, N document-tier questions
Document facets + confidence
    ↓ chunk
Chunk + context window (heading, prior chunk, doc title)
    ↓ one request per chunk, M chunk-tier questions
Chunk facets + confidence
    ↓ inherit document facets as defaults, chunk facets override
Vector store: embedding + merged facets + per-facet confidence + tier + disagreement flag
```

**Document tier** — properties genuinely scoped to the whole document:
authority · currency (current or superseded) · document type · audience level · provenance

**Chunk tier** — properties about a passage's role, which vary within one document:
normative vs descriptive · rule vs exception · assumes prior context · conceptual vs procedural

**Inheritance rule:** document facets inherit down as defaults; chunk facets override where they disagree. **Record the disagreement.** A chunk whose label contradicts its parent document is how you find the appendix that does not belong, or the deprecated section inside a current doc. That flag may be more valuable than either label alone.

**Context window:** chunk-tier requests carry the preceding heading, the prior chunk, and the document title alongside the chunk. Costs more per request; removes most of the isolation problem. Measure with and without — the delta is a publishable result on its own.

### 2.2 Cost, honestly

The "document dominates the bill" claim holds at document scale and **breaks at chunk scale**. Their figure is a ~54k-char document (~13.5k tokens) with 13 questions (~650 tokens) — text is ~95% of the payload. At 2k-char chunks (~500 tokens) the same 13 questions are ~650 tokens, so questions are **~43% of the payload and cost more than the chunk**.

Derived from their published figures, not published themselves, and to be replaced by measured numbers:

| | Text | Questions | Question share |
|---|---|---|---|
| Document (54k chars) | ~13,500 tok | ~650 tok | ~5% |
| Chunk (2k chars) | ~500 tok | ~650 tok | **~57%** |

Implied unit cost from their run: 13 calls at $0.006090 is ~$0.000468 each, roughly **$0.035 per million tokens**. One document ≈ $0.0005; the same document as 27 chunks ≈ $0.0011 — about **2.2x more**, returning 351 labels instead of 13.

So cost favours the document tier, but weakly: 2.2x of a rounding error is a rounding error. **Run both tiers.** The reason to choose a granularity is determinability, not price. Measure the real ratio during the run and correct these estimates.

### 2.2b Semantic chunk boundaries (fourth arm)

If the document is being analysed before chunking anyway, use it to decide **where to chunk** — score candidate boundaries for topic shift rather than splitting every 2,000 characters. Semantic chunking is not new; cheap per-document judgment makes it affordable.

Worth testing as arm D, because chunk quality upstream may matter more to retrieval than facet quality downstream. If D beats B and C, the story changes entirely: the win was never the facets.

### 2.3 Query path — four arms, one pipeline

```text
Question
   ↓ decompose to facet expectations (one Jev call)
   ↓
   ├── A. similarity only ─────────────┐
   ├── B. similarity ∩ facet gate ─────┤
   └── C. similarity ∪ facet recall ───┤
                                       ↓
                        Query-time scoring (cookbook)
                        relevance / evidence / contradiction / injection
                                       ↓
                    accepted │ conflicting │ excluded
                                       ↓
                                  Generation
```

- **A — baseline.** Today's pipeline. Embed, rank, top-k.
- **B — narrowing.** Facets as a hard pre-filter. Fast and cheap, and the arm most likely to silently drop answers.
- **C — widening, no discards.** Retrieve the **union** of similarity hits and facet matches. Facets add recall instead of removing candidates; the query-time judge does all excluding. One exclusion point, and it is the recoverable one.

Each arm then runs the cookbook's scoring pass (injection >0.70 out, contradiction >0.70 to its own block, relevance <0.45 out, evidence >0.55 in) so the comparison isolates **retrieval strategy** rather than confounding it with scoring.

> Note on stacking B with the query-time judge: you pay for exclusion twice and compound the chance of dropping the answer. If B wins, verify it still wins with scoring enabled.

### 2.4 The highest-value use may not be retrieval

Index-time facets can pre-mark chunks as **deprecated, superseded, or exceptional**, feeding the conflicting-evidence block directly instead of making the query-time pass rediscover that on every request. The contradiction bucket is the most valuable part of the cookbook; this is how it becomes reliable rather than incidental. Measure this as its own outcome — it may be the real result even if B and C tie with A on recall.

---

## 3. What to measure

### 3.1 The number that decides it

> **Gate-out rate: how often does the known-correct chunk get excluded before retrieval runs?**

Measured on arm B only, because only B can do this. If near zero on your corpus, B is safe and the simpler design wins. If it is a few percent, B is disqualified regardless of its precision numbers — and you have a measured finding nobody has published.

### 3.2 Per-arm metrics

| Metric | Why |
|---|---|
| recall@k (k = 5, 10, 20) | Did the right chunk survive to the candidate set? |
| Gate-out rate | B only. The decisive number. |
| Recall added by facets | C only. Chunks found by facet that similarity missed — the case for C. |
| Precision after scoring | Share of accepted passages that are genuinely relevant. |
| Exclusion rate | Compare to the cookbook's ~67%. |
| Conflicting-block recall | Did known-contradicting chunks land in the conflicting block? |
| Answer correctness | Blind-graded against ground truth. The only metric that matters commercially. |
| End-to-end latency | p50 and p95, decomposed by hop. |
| Cost per query | Ingestion amortised separately. |

### 3.3 Ingestion economics

- Total ingestion cost, and cost per 1,000 chunks
- **Marginal cost of one additional dimension** — the claim that this is near-free
- Wall-clock for a full pass, and the re-index cost implied by a taxonomy change
- **Facet accuracy per tier**: hand-label 100 random chunks and 25 documents, compare to Jev's labels, report per-dimension agreement **separately for each tier**. A facet at 80% agreement is not usable as a hard gate.
- **Tier disagreement rate**: share of chunks whose facet contradicts its parent document's. Report what those chunks turn out to be.
- **Context-window delta**: chunk-tier agreement with and without the surrounding context, per dimension.
- **Cost ratio between tiers**, measured, against the ~2.2x estimated in §2.2.

### 3.4 Drift control

The docs state `jev-latest` aliases `jev-1.13.0` and that "the answers behind it can change without a change on your side."

- **Pin an explicit version for ingestion.** Record it in the index.
- Re-run 100 chunks after any version change and report label churn.
- Treat a version bump as a re-index migration, not a config change.

---

## 4. Corpus and ground truth

**Corpus:** one you know well. The Signal Room account briefs and research sources are a candidate — real, unstructured, and yours. Anything you cannot write ground truth for is unusable here.

**Query set:** 40–60 questions, deliberately including:
- Questions whose answer sits in an **atypically-worded** chunk (tests C's recall claim)
- Questions whose premise is **false** (tests the conflicting block)
- Questions whose answer is in a chunk whose **facets are ambiguous** (tests B's gate-out risk)
- Questions answerable only by **combining two chunks** with different facets (B's worst case)
- Questions with **no answer in the corpus** (tests whether the pipeline abstains)

**Ground truth:** for each question, the chunk ID(s) containing the answer, written **before** running any arm. This is the part that takes the time and the part that makes the result publishable.

---

## 5. Sequence

1. Chunk the corpus; freeze it. Every arm uses identical chunks.
2. Write ground truth for the query set. Before any retrieval runs.
3. Arm A baseline. Record everything in §3.2.
4. Document-tier ingestion pass with pinned version. Record §3.3.
5. Chunk-tier ingestion pass with context windows. Record cost ratio against the document tier.
6. Merge tiers by the inheritance rule; record the disagreement flag on every chunk where they conflict.
7. Hand-label 100 chunks and 25 documents; compute facet accuracy **per tier**. **If any dimension is below ~90% agreement, do not use it as a gate in B.**
8. Arm B. Compute gate-out rate first — it may end B immediately.
9. Arm C.
10. Arm D: re-chunk on semantic boundaries, re-run the strongest arm so far.
11. Blind-grade answers across arms. Shuffle so the grader cannot tell which arm produced which answer.
12. Write up, including whatever contradicts the hypothesis.

---

## 6. Falsifiable predictions

Written in advance so the result cannot be rationalised after the fact.

1. **C ≥ A on recall@10**, by a margin larger than noise. If not, facets add nothing to retrieval and only §2.4 survives.
2. **B shows a non-zero gate-out rate**, concentrated in multi-facet questions. If it is zero, my objection was theoretical and B is viable.
3. **Marginal cost per extra dimension is under 10% of the first dimension's cost.** If not, the economic argument for corpus-wide enrichment is weaker than stated.
4. **At least one dimension falls below 90% hand-label agreement.** Judgment facets are harder than they look.
5. **Conflicting-block recall improves most** when facets pre-mark superseded content — §2.4 outperforms both retrieval arms.
6. **Document-tier facets beat chunk-tier on hand-label agreement**, because they are asked where the evidence actually is.
7. **Chunk facets disagree with their parent document on 5-15% of chunks**, and those disagreements are disproportionately useful. If disagreement is near zero, the chunk tier is redundant and document-only wins.
8. **Chunk-tier ingestion costs 2-3x document-tier**, matching the estimate in §2.2. A wider gap means chunk-tier needs justifying on determinability alone.
9. **Semantic boundaries (arm D) improve recall@10 more than either facet arm.** If true, the headline result is chunking, not facets.

Any of these being wrong is publishable. Prediction 2 being wrong is the most interesting outcome, because it means the simple design works and the caution was unnecessary.

---

## 7. Publishing constraints

Per `src/lib/signal-room/content-rules.ts`:

- Every figure needs a claim-ledger entry with its source. Self-measured numbers cite the run.
- State the corpus size, domain and date. A result from one corpus is not a general result, and saying so is what makes it credible.
- Report the arms that lost. A post that only reports the winning arm is marketing.
- Keep it to one corpus and say so. Do not generalise to "RAG" from a single dataset.
- No client data. If the corpus touches an engagement, use something else.

---

## 8. What this unblocks

Three argument posts are queued in Post Lab and can publish before any of this runs — they argue from the cookbooks, which is honest and cites sources.

This test produces the fourth, which is the only one with a measured result of yours in it. It is also the only one that supports the expert positioning, because it would be the first published numbers on index-time judgment facets rather than a reading of someone else's documentation.

**The measured post cannot be written until §5 completes. Do not draft it early.**
