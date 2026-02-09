"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function GradientBackground() {
  const { scrollYProgress } = useScroll();

  const hueShift = useTransform(scrollYProgress, [0, 0.5, 1], [220, 260, 300]);

  return (
    <motion.div
      className="fixed inset-0 z-[-2]"
      aria-hidden="true"
      style={
        {
          "--hue": hueShift,
        } as React.CSSProperties
      }
    >
      {/* Light mode */}
      <div className="absolute inset-0 bg-gray-50 dark:hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_40%,#C9EBFF,transparent)] dark:hidden" />

      {/* Dark mode */}
      <div className="absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgba(59,130,246,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_80%,rgba(168,85,247,0.08),transparent)]" />
      </div>

      {/* Animated mesh gradient overlay (dark mode only) */}
      <div
        className="absolute inset-0 hidden opacity-30 dark:block animate-gradient-shift motion-reduce:animate-none"
        style={{
          backgroundImage:
            "linear-gradient(-45deg, rgba(59,130,246,0.15), rgba(120,119,198,0.15), rgba(168,85,247,0.15), rgba(59,130,246,0.15))",
          backgroundSize: "400% 400%",
        }}
      />
    </motion.div>
  );
}
