"use client";

import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NavBar() {
  return (
    <motion.header
      className="sticky top-0 z-40 w-full"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            width={100}
            height={100}
            className="h-10 w-10"
            alt="YenUS logo"
            title="YenUS logo"
          />
        </div>
        <ModeToggle />
      </div>
    </motion.header>
  );
}
