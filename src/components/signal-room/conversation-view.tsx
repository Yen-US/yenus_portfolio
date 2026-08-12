"use client";

import { MessageSquareText, Send, Sparkles, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { apiJson } from "@/lib/signal-room/client";
import { getConnectionNoteChecks, getToneChecks } from "@/lib/signal-room/tone-checks";
import type {
  Account,
  ConnectionNote,
  ConversationMessage,
  CorrectionOpener,
  ReplyAnalysis,
} from "@/lib/signal-room/types";
import {
  CopyButton,
  Field,
  StatusBadge,
  StudioButton,
  StudioSelect,
  StudioTextarea,
} from "@/components/signal-room/ui";

/**
 * LinkedIn conversation capture. Nothing is ever sent from here: messages are
 * drafted, copied out, pasted into LinkedIn by hand, and their replies pasted
 * back. That boundary is deliberate and matches docs/signal-room.md.
 */
export function ConversationView({
  account,
  mode,
  onChange,
}: {
  account: Account;
  mode: "supabase" | "demo";
  onChange: (account: Account) => void;
}) {
  const [opener, setOpener] = useState<CorrectionOpener | null>(null);
  const [note, setNote] = useState<ConnectionNote | null>(null);
  const [noteText, setNoteText] = useState("");
  const [skipFieldTest, setSkipFieldTest] = useState(false);
  const [patternLine, setPatternLine] = useState("");
  const [isNoting, startNote] = useTransition();
  const [draft, setDraft] = useState("");
  const [reply, setReply] = useState("");
  const [analysis, setAnalysis] = useState<ReplyAnalysis | null>(null);
  const [direction, setDirection] = useState<"sent" | "received">("sent");
  const [containedAsk, setContainedAsk] = useState(false);
  const [error, setError] = useState("");
  const [isDrafting, startDraft] = useTransition();
  const [isAnalyzing, startAnalyze] = useTransition();
  const [isLogging, startLog] = useTransition();

  const hasFieldTest = account.observations.length > 0;
  const canDraft = hasFieldTest || skipFieldTest;
  const toneChecks = getToneChecks(draft);
  const noteChecks = getConnectionNoteChecks(noteText);
  const failedChecks = toneChecks.filter((check) => !check.passed);

  function generateConnectionNote() {
    setError("");
    startNote(async () => {
      try {
        const result = await apiJson<{ note: ConnectionNote }>(
          "/api/signal-room/outreach-message",
          {
            method: "POST",
            body: JSON.stringify({
              format: "connection",
              account: {
                name: account.name,
                oneLiner: account.oneLiner,
                approxUsers: account.approxUsers,
                targetName: account.targetName,
                targetRole: account.targetRole,
              },
              brief: account.brief,
              observations: account.observations,
              skipFieldTest,
              patternLine,
            }),
          }
        );
        setNote(result.note);
        setNoteText(result.note.note);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Draft failed.");
      }
    });
  }

  function generateOpener() {
    setError("");
    startDraft(async () => {
      try {
        const result = await apiJson<{ opener: CorrectionOpener }>(
          "/api/signal-room/outreach-message",
          {
            method: "POST",
            body: JSON.stringify({
              account: {
                name: account.name,
                oneLiner: account.oneLiner,
                approxUsers: account.approxUsers,
                targetName: account.targetName,
                targetRole: account.targetRole,
              },
              brief: account.brief,
              observations: account.observations,
              skipFieldTest,
            }),
          }
        );
        setOpener(result.opener);
        setDraft(result.opener.fullMessage);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Draft failed.");
      }
    });
  }

  function analyzeTheReply() {
    setError("");
    startAnalyze(async () => {
      try {
        const result = await apiJson<{ analysis: ReplyAnalysis }>("/api/signal-room/messages", {
          method: "POST",
          body: JSON.stringify({
            action: "analyze",
            account: {
              name: account.name,
              oneLiner: account.oneLiner,
              targetName: account.targetName,
              targetRole: account.targetRole,
            },
            brief: account.brief,
            observations: account.observations,
            thread: account.messages,
            reply,
          }),
        });
        setAnalysis(result.analysis);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Analysis failed.");
      }
    });
  }

  function logMessage(body: string, messageDirection: "sent" | "received", withAsk: boolean) {
    if (!body.trim()) return;
    setError("");
    startLog(async () => {
      const payload = {
        accountId: account.id,
        direction: messageDirection,
        channel: "linkedin",
        body,
        containedAsk: withAsk,
        occurredAt: new Date().toISOString(),
        analysis: messageDirection === "received" ? analysis : null,
      };
      try {
        let saved: ConversationMessage;
        if (mode === "supabase") {
          const result = await apiJson<{ message: ConversationMessage }>(
            "/api/signal-room/messages",
            { method: "POST", body: JSON.stringify(payload) }
          );
          saved = result.message;
        } else {
          saved = { ...payload, id: `demo-${crypto.randomUUID()}`, analysis: payload.analysis };
        }
        onChange({
          ...account,
          messages: [...account.messages, saved],
          status: messageDirection === "received" ? "replied" : "contacted",
          askSentAt: withAsk ? payload.occurredAt : account.askSentAt,
        });
        if (messageDirection === "received") setReply("");
        else setDraft("");
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Log failed.");
      }
    });
  }

  return (
    <div className="mt-7 space-y-8">
      {error ? (
        <p className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-8">
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">Correction opener</h3>
              <StudioButton onClick={generateOpener} loading={isDrafting} disabled={!canDraft}>
                <Sparkles className="h-4 w-4" />
                Draft opener
              </StudioButton>
            </div>

            {!hasFieldTest ? (
              <div className="mt-4 border border-brass/30 bg-brass/5 p-5">
                <p className="text-xs font-semibold text-brass">No field test logged</p>
                <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                  A weakness you measured yourself is the strongest hook this system has — it
                  proves you showed up. Log one in the Field test tab if the product allows it.
                </p>
                <label className="mt-4 flex cursor-pointer items-start gap-3 border-t border-brass/20 pt-4">
                  <input
                    type="checkbox"
                    checked={skipFieldTest}
                    onChange={(event) => setSkipFieldTest(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brass"
                  />
                  <span className="text-[11px] leading-5 text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      I can&apos;t use this product
                    </span>{" "}
                    — sales-gated, waitlisted, or priced out of a quick test. Draft from public
                    signal instead: the message will open on something they published rather than
                    something you measured, and will never imply you used the product.
                  </span>
                </label>
              </div>
            ) : null}

            {opener ? (
              <div className="mt-4 space-y-3 border border-border bg-card p-5 text-xs leading-6">
                {opener.hookType === "pattern" ? (
                  <p className="border-l-2 border-brass pl-3 text-[11px] leading-5 text-muted-foreground">
                    Pattern hook — built from public signal, not measurement. Check before sending
                    that it never claims you used the product.
                  </p>
                ) : null}
                <Part label="Strengths" value={opener.strengths.join(" · ")} />
                <Part
                  label={opener.hookType === "pattern" ? "Public signal" : "The one weakness"}
                  value={opener.weakness}
                />
                <Part
                  label={
                    opener.hookType === "pattern"
                      ? "Pattern tension (their cue to correct you)"
                      : "Hypothesis (their cue to correct you)"
                  }
                  value={opener.hypothesis}
                />
                <Part label="Scaling question" value={opener.scalingQuestion} />
                {opener.selfCheck.notes.length > 0 ? (
                  <div className="border-t border-border pt-3">
                    <p className="consulting-kicker text-brass">Model self-check notes</p>
                    {opener.selfCheck.notes.map((note) => (
                      <p key={note} className="mt-1 text-[11px] text-muted-foreground">— {note}</p>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8 border-t border-border pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold">Connection note</h4>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                    Under 300 characters — LinkedIn&apos;s hard cap on a request note. Send this
                    first; the opener above is what you send once they accept.
                  </p>
                </div>
                <StudioButton
                  variant="secondary"
                  onClick={generateConnectionNote}
                  loading={isNoting}
                  disabled={!canDraft}
                >
                  <Sparkles className="h-4 w-4" />
                  Draft note
                </StudioButton>
              </div>

              <div className="mt-4">
                <Field
                  label="Pattern to reference (optional)"
                  hint="Your own framing, e.g. quota + substitution + latency decisions made implicitly. Left blank, it derives one from the brief."
                >
                  <StudioTextarea
                    value={patternLine}
                    onChange={(event) => setPatternLine(event.target.value)}
                    className="min-h-16"
                  />
                </Field>
              </div>

              {note ? (
                <div className="mt-4 border border-border bg-card">
                  <div className="flex items-center justify-between border-b border-border px-4 py-2">
                    <p className="consulting-kicker text-muted-foreground">Note</p>
                    <div className="flex items-center gap-3">
                      <StatusBadge tone={noteText.trim().length <= 300 ? "good" : "warn"}>
                        {noteText.trim().length}/300
                      </StatusBadge>
                      <CopyButton text={noteText} label="Copy note" />
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <StudioTextarea
                      value={noteText}
                      onChange={(event) => setNoteText(event.target.value)}
                      className="min-h-28 text-sm leading-6"
                    />
                  </div>
                  <div className="divide-y divide-border border-t border-border">
                    {noteChecks.map((check) => (
                      <div key={check.id} className="flex gap-3 px-4 py-3">
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            check.passed ? "bg-signal" : "bg-brass"
                          }`}
                        />
                        <div>
                          <p className="text-[11px] font-semibold">{check.label}</p>
                          <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
                            {check.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 border-t border-border px-4 py-3">
                    <Part label="Signal it opens on" value={note.signalUsed} />
                    <Part label="Deliberately withheld" value={note.withheld} />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5">
              <Field label="Message to send" hint="Edit freely. Copy out and paste into LinkedIn yourself.">
                <StudioTextarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="min-h-48"
                />
              </Field>

              {draft ? (
                <div className="mt-4 border border-border">
                  <div className="flex items-center justify-between border-b border-border px-4 py-2">
                    <p className="consulting-kicker text-muted-foreground">Tone check</p>
                    <StatusBadge tone={failedChecks.length === 0 ? "good" : "warn"}>
                      {toneChecks.length - failedChecks.length}/{toneChecks.length}
                    </StatusBadge>
                  </div>
                  <div className="divide-y divide-border">
                    {toneChecks.map((check) => (
                      <div key={check.id} className="flex gap-3 px-4 py-3">
                        <span
                          className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                            check.passed ? "bg-signal" : "bg-brass"
                          }`}
                        />
                        <div>
                          <p className="text-[11px] font-semibold">{check.label}</p>
                          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{check.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <CopyButton text={draft} label="Copy message" />
                <label className="flex items-center gap-2 text-[11px]">
                  <input
                    type="checkbox"
                    checked={containedAsk}
                    onChange={(event) => setContainedAsk(event.target.checked)}
                    className="h-4 w-4"
                  />
                  Contains the 30-minute ask
                </label>
                <StudioButton
                  variant="secondary"
                  onClick={() => logMessage(draft, "sent", containedAsk)}
                  loading={isLogging}
                  disabled={!draft.trim()}
                >
                  <Send className="h-4 w-4" />
                  Log as sent
                </StudioButton>
              </div>
            </div>
          </section>

          <section className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold">Their reply</h3>
            <Field label="Paste the reply" hint="Paste their LinkedIn text here. Extraction is intentionally manual.">
              <StudioTextarea
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                className="mt-2 min-h-32"
              />
            </Field>
            <div className="mt-3 flex flex-wrap gap-3">
              <StudioButton onClick={analyzeTheReply} loading={isAnalyzing} disabled={!reply.trim()}>
                <Sparkles className="h-4 w-4" />
                Analyze reply
              </StudioButton>
              <StudioButton
                variant="secondary"
                onClick={() => logMessage(reply, "received", false)}
                loading={isLogging}
                disabled={!reply.trim()}
              >
                Log reply
              </StudioButton>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {analysis ? <AnalysisCard analysis={analysis} /> : null}

          <section>
            <h3 className="text-sm font-semibold">Thread</h3>
            <div className="mt-3 space-y-3">
              {account.messages.map((message) => (
                <div
                  key={message.id}
                  className={`border-l-2 p-4 ${
                    message.direction === "sent"
                      ? "border-signal bg-secondary/40"
                      : "border-brass bg-brass/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <StatusBadge tone={message.direction === "sent" ? "neutral" : "warn"}>
                      {message.direction === "sent" ? "me" : "them"}
                    </StatusBadge>
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {new Date(message.occurredAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-xs leading-6">{message.body}</p>
                  {message.containedAsk ? (
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-signal">
                      contained the ask
                    </p>
                  ) : null}
                </div>
              ))}
              {account.messages.length === 0 ? (
                <p className="border border-dashed border-border p-6 text-xs leading-5 text-muted-foreground">
                  No messages logged yet.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function AnalysisCard({ analysis }: { analysis: ReplyAnalysis }) {
  const readinessTone =
    analysis.askReadiness === "ask_now" ? "good" : analysis.askReadiness === "soon" ? "warn" : "neutral";

  return (
    <section className="border border-border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone={analysis.intent === "corrected_you" ? "good" : "neutral"}>
          {analysis.intent.replace(/_/g, " ")}
        </StatusBadge>
        <StatusBadge tone={readinessTone}>ask: {analysis.askReadiness.replace(/_/g, " ")}</StatusBadge>
        {analysis.egoRisk !== "none" ? (
          <StatusBadge tone="warn">ego risk: {analysis.egoRisk}</StatusBadge>
        ) : null}
      </div>

      {analysis.correctionQuote ? (
        <div className="mt-5">
          <p className="consulting-kicker text-signal">They corrected you</p>
          <blockquote className="mt-2 border-l-2 border-signal pl-3 text-sm leading-6">
            {analysis.correctionQuote}
          </blockquote>
        </div>
      ) : null}

      {analysis.hypothesisUpdates.length > 0 ? (
        <div className="mt-5 border-t border-border pt-4">
          <p className="consulting-kicker text-muted-foreground">Hypothesis verdicts</p>
          {analysis.hypothesisUpdates.map((update) => (
            <div key={update.hypothesis} className="mt-3">
              <div className="flex items-start gap-2">
                <StatusBadge tone={update.verdict === "confirmed" ? "good" : update.verdict === "refuted" ? "warn" : "neutral"}>
                  {update.verdict}
                </StatusBadge>
              </div>
              <p className="mt-2 text-[11px] leading-5">{update.hypothesis}</p>
              {update.evidenceQuote ? (
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">“{update.evidenceQuote}”</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {analysis.extractedNumbers.length > 0 ? (
        <div className="mt-5 border-t border-border pt-4">
          <p className="consulting-kicker text-muted-foreground">Numbers they stated</p>
          {analysis.extractedNumbers.map((number) => (
            <p key={`${number.label}-${number.value}`} className="mt-2 text-[11px] leading-5">
              <span className="font-semibold">{number.label}:</span> {number.value}
              <span className="block text-muted-foreground">“{number.quote}”</span>
            </p>
          ))}
        </div>
      ) : null}

      <div className="mt-5 border-t border-border pt-4">
        <p className="consulting-kicker text-muted-foreground">Ask readiness</p>
        <p className="mt-2 text-[11px] leading-5">{analysis.askRationale}</p>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="consulting-kicker text-muted-foreground">Next question</p>
        </div>
        <p className="mt-2 text-[11px] leading-5">{analysis.suggestedNextQuestion}</p>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="consulting-kicker text-muted-foreground">Draft response</p>
          <CopyButton text={analysis.draftResponse} />
        </div>
        <p className="mt-2 whitespace-pre-wrap text-xs leading-6">{analysis.draftResponse}</p>
      </div>
    </section>
  );
}

function Part({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="consulting-kicker text-signal">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
