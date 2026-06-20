"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tiltEnabled?: boolean;
  /** Render with no internal padding so children can manage their own bleed. */
  bleed?: boolean;
}

export function GlassCard({
  children,
  className,
  tiltEnabled = true,
  bleed = false,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateSupport = () => setSupportsHover(mediaQuery.matches);
    updateSupport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateSupport);
      return () => mediaQuery.removeEventListener("change", updateSupport);
    }
    mediaQuery.addListener(updateSupport);
    return () => mediaQuery.removeListener(updateSupport);
  }, []);

  const shouldTilt = tiltEnabled && supportsHover && !prefersReducedMotion;

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 180, damping: 22 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), springConfig);

  const glowX = useTransform(mouseX, [0, 1], [0, 100]);
  const glowY = useTransform(mouseY, [0, 1], [0, 100]);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, hsl(var(--brass) / 0.18), transparent 55%)`
  );

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current || !shouldTilt) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX: shouldTilt ? rotateX : 0,
        rotateY: shouldTilt ? rotateY : 0,
        transformStyle: "preserve-3d",
        willChange: shouldTilt ? "transform" : "auto",
      }}
      className={cn(
        "group/glass relative h-full overflow-hidden rounded-2xl border transition-colors duration-300",
        "border-black/[0.06] bg-white/60 dark:border-white/[0.06] dark:bg-white/[0.025]",
        "backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_60px_-30px_rgba(0,0,0,0.45)]",
        "hover:border-brass/30 dark:hover:border-brass/25",
        className
      )}
    >
      {/* Brass glow */}
      {shouldTilt && (
        <motion.div
          className="pointer-events-none absolute -inset-px z-0 rounded-2xl transition-opacity duration-300"
          style={{
            background: glowBackground,
            opacity: isHovered ? 1 : 0,
          }}
          aria-hidden="true"
        />
      )}

      {/* Top hairline */}
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brass/30 to-transparent opacity-60"
        aria-hidden="true"
      />

      <div className={cn("relative z-10 h-full", bleed ? "" : "p-6 md:p-7")}>
        {children}
      </div>
    </motion.div>
  );
}
