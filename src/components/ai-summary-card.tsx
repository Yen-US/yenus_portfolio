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
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Type out the initial summary on mount
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
    <div className="flex h-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500 animate-sparkle" />
          <h2 className="text-lg font-semibold">AI Insight</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full hover:bg-white/10"
          onClick={handleRefresh}
          disabled={isTyping || isLoading}
          title="Refresh insight"
        >
          <motion.div
            whileTap={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <RotateCw className="h-3.5 w-3.5" />
          </motion.div>
        </Button>
      </div>

      {/* Summary display */}
      <div className="flex-1 min-h-[80px]">
        <AnimatePresence mode="wait">
          {isLoading && !displayedText ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-3/4 bg-white/10" />
              <Skeleton className="h-4 w-1/2 bg-white/10" />
            </motion.div>
          ) : (
            <motion.div
              key="text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-4 ml-0.5 bg-purple-500 animate-pulse align-middle" />
                )}
                {!isTyping && displayedText && '"'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ask input */}
      <div className="space-y-2">
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
              requestCount >= MAX_REQUESTS
                ? "Limit reached"
                : "Ask about me..."
            }
            disabled={isLoading || requestCount >= MAX_REQUESTS}
            className="bg-white/5 border-white/10 text-sm placeholder:text-muted-foreground/50"
            maxLength={200}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={!question.trim() || isLoading || requestCount >= MAX_REQUESTS}
            className="shrink-0 hover:bg-white/10"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-[10px] text-muted-foreground/50 text-center">
          {requestCount}/{MAX_REQUESTS} questions used
          {!isOnDemand && " · Pre-generated insight"}
        </p>
      </div>
    </div>
  );
}
