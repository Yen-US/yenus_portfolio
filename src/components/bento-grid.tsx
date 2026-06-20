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
        "grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5 lg:gap-6",
        className
      )}
      initial={prefersReducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: prefersReducedMotion ? 0 : 0.08 },
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
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3;
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
    4: "md:col-span-4",
  }[colSpan];

  const rowSpanClass = {
    1: "row-span-1",
    2: "md:row-span-2",
    3: "md:row-span-3",
  }[rowSpan];

  return (
    <motion.div
      className={cn(colSpanClass, rowSpanClass, "min-h-0", className)}
      variants={{
        hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 110, damping: 18 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
