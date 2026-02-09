"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function SectionReveal({
  children,
  className,
  delay = 0,
}: SectionRevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
