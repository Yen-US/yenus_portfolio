"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, SendHorizontal, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import summaries from "@/data/generated-summaries.json";

export function AiSummaryCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [isOnDemand, setIsOnDemand] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const MAX_REQUESTS = 3;

  const typeText = useCallback((text: string) => {
    setIsTyping(true);
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 18);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = typeText(summaries[0]);
    return cleanup;
  }, [typeText]);

  function handleRefresh() {
    const nextIndex = (currentIndex + 1) % summaries.length;
    setCurrentIndex(nextIndex);
    setIsOnDemand(false);
    typeText(summaries[nextIndex]);
  }

  async function handleAsk() {
    if (!question.trim() || isLoading || requestCount >= MAX_REQUESTS) return;

    setIsLoading(true);
    setIsOnDemand(true);
    setDisplayedText("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        setDisplayedText(data.error || "Something went wrong.");
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setDisplayedText("Failed to read response.");
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setDisplayedText(accumulated);
      }

      setRequestCount((c) => c + 1);
      setQuestion("");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setDisplayedText("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">
            02
          </span>
          <h2 className="font-display text-2xl leading-none tracking-tight">
            Ask me
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:bg-foreground/5 hover:text-brass"
          onClick={handleRefresh}
          disabled={isTyping || isLoading}
          title="Refresh insight"
          aria-label="Refresh insight"
        >
          <motion.div whileTap={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <RotateCw className="h-3.5 w-3.5" />
          </motion.div>
        </Button>
      </div>

      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <Sparkles className="h-3 w-3 text-brass" />
        {isOnDemand ? "Live response" : "Pre-generated"}
      </div>

      <div className="flex-1 min-h-[120px]">
        <AnimatePresence mode="wait">
          {isLoading && !displayedText ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <Skeleton className="h-4 w-full bg-foreground/5" />
              <Skeleton className="h-4 w-5/6 bg-foreground/5" />
              <Skeleton className="h-4 w-3/5 bg-foreground/5" />
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-display text-base leading-relaxed text-foreground/90">
                <span className="text-brass">“</span>
                {displayedText}
                {isTyping && (
                  <span className="ml-0.5 inline-block h-4 w-px bg-brass align-middle animate-caret-blink" />
                )}
                {!isTyping && displayedText && (
                  <span className="text-brass">”</span>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 border-t border-border/50 pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex gap-2"
        >
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              requestCount >= MAX_REQUESTS ? "Limit reached" : "Ask something specific…"
            }
            disabled={isLoading || requestCount >= MAX_REQUESTS}
            className="h-10 rounded-full border-border/60 bg-secondary/40 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-brass/40"
            maxLength={200}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!question.trim() || isLoading || requestCount >= MAX_REQUESTS}
            className="h-10 w-10 shrink-0 rounded-full bg-brass text-background hover:bg-brass/90 disabled:bg-secondary disabled:text-muted-foreground"
            aria-label="Ask"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
          {requestCount}/{MAX_REQUESTS} questions · powered by GPT-4o
        </p>
      </div>
    </div>
  );
}
