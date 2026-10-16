"use client";

import { useEffect, useRef } from "react";

/**
 * The fixed mobile action bar. It is in the server HTML and visible without
 * JavaScript; with JavaScript it steps out of the way while the title block
 * actions (the same actions) are on screen, so nothing is shown twice.
 */
export function ActionBar({ watch, children }: { watch: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = document.getElementById(watch);
    const bar = ref.current;
    if (!target || !bar || !("IntersectionObserver" in window)) return;
    // Hide only while most of the watched actions are on screen, so the first
    // phone viewport (where the title block has barely entered) keeps its bar.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) bar.setAttribute("data-hidden", "");
        else bar.removeAttribute("data-hidden");
      },
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watch]);

  return (
    <nav ref={ref} className="sh-bar lg:hidden" aria-label="Quick actions">
      {children}
    </nav>
  );
}
