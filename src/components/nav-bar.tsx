"use client";

import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NavBar() {
  return (
    <motion.header
      className="sticky top-0 z-40 w-full backdrop-blur-md"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 18 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3 focus-ring rounded-full">
          <Image
            src="/logo.png"
            width={36}
            height={36}
            alt="YenUS"
            priority
            className="h-8 w-8 rounded-full"
          />
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground sm:block">
            Yenus<span className="text-brass">.dev</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="https://presencia.studio"
            target="_blank"
            rel="noopener"
            className="hidden rounded-full border border-border/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-brass/40 hover:text-brass sm:inline-block focus-ring"
          >
            presencia.studio ↗
          </Link>
          <ModeToggle />
        </div>
      </div>
    </motion.header>
  );
}
