"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5",
        className
      )}
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
}

export function BentoCard({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
}: BentoCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const colSpanClass = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
  }[colSpan];

  const rowSpanClass = {
    1: "row-span-1",
    2: "row-span-2",
  }[rowSpan];

  return (
    <motion.div
      className={cn(colSpanClass, rowSpanClass, className)}
      variants={{
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 100, damping: 15 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
