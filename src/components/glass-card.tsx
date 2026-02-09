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
}

export function GlassCard({
  children,
  className,
  tiltEnabled = true,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updateSupport = () => {
      setSupportsHover(mediaQuery.matches);
    };

    updateSupport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateSupport);
      return () => {
        mediaQuery.removeEventListener("change", updateSupport);
      };
    }

    mediaQuery.addListener(updateSupport);

    return () => {
      mediaQuery.removeListener(updateSupport);
    };
  }, []);

  const shouldTilt = tiltEnabled && supportsHover && !prefersReducedMotion;

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [8, -8]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-8, 8]),
    springConfig
  );

  const glowX = useTransform(mouseX, [0, 1], [0, 100]);
  const glowY = useTransform(mouseY, [0, 1], [0, 100]);

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
        "relative overflow-hidden rounded-2xl border transition-colors duration-300",
        "bg-white/70 border-white/20 dark:bg-white/5 dark:border-white/10",
        "backdrop-blur-xl shadow-lg",
        "hover:shadow-xl hover:border-white/30 dark:hover:border-white/20",
        className
      )}
    >
      {/* Glow effect — hidden on touch/reduced motion */}
      {shouldTilt && (
        <motion.div
          className="pointer-events-none absolute -inset-px z-0 rounded-2xl transition-opacity duration-300"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(circle at ${x}% ${y}%, rgba(120, 119, 198, 0.15), transparent 60%)`
            ),
            opacity: isHovered ? 1 : 0,
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 h-full p-6">{children}</div>
    </motion.div>
  );
}
