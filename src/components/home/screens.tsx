"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Screen } from "@/lib/home-data";

/**
 * The phone: real public screens of a product in a horizontal scroll-snap
 * track. Without JavaScript it is a native swipe carousel showing the first
 * screen. With JavaScript, tapping the phone steps to the next screen, the
 * dots become live controls, arrow keys work, and the current screen is named.
 */
export function Screens({
  name,
  screens,
  priority = false,
  copy,
  children,
}: {
  name: string;
  screens: Screen[];
  priority?: boolean;
  /** The card's name and line, rendered inside the field above the phone. */
  copy: React.ReactNode;
  /** The card's action, rendered with the dots and the screen name. */
  children?: React.ReactNode;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const pointer = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIndex(Math.round(el.scrollLeft / el.clientWidth)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = (i + screens.length) % screens.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "auto" });
    setIndex(next);
  };

  return (
    <>
      <div className="hm-field">
        {copy}
        <div
          className="hm-phone"
          role="group"
          aria-roledescription="carousel"
          aria-label={`Screens of ${name}. Tap or swipe for the next screen.`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
          onPointerDown={(e) => {
            pointer.current = { x: e.clientX, y: e.clientY, t: Date.now() };
          }}
          onPointerUp={(e) => {
            const p = pointer.current;
            pointer.current = null;
            // A tap, not a drag or a long press, steps to the next screen.
            if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) < 8 && Date.now() - p.t < 400) go(index + 1);
          }}
        >
          <ul ref={track} className="hm-track m-0 list-none p-0" tabIndex={-1}>
            {screens.map((s, i) => (
              <li key={s.src} aria-hidden={i !== index} aria-label={`${i + 1} of ${screens.length}: ${s.label}`}>
                <Image
                  src={s.src}
                  alt={`${name}: ${s.label}`}
                  width={600}
                  height={1298}
                  sizes="(min-width: 640px) 17rem, 66vw"
                  priority={priority && i === 0}
                  fetchPriority={priority && i === 0 ? "high" : undefined}
                  loading={priority && i === 0 ? undefined : "lazy"}
                  draggable={false}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hm-card-side">
        <ol className="hm-dots m-0 list-none p-0" aria-label={`Choose a screen of ${name}`}>
          {screens.map((s, i) => (
            <li key={s.src}>
              <button type="button" aria-label={s.label} aria-current={i === index ? "true" : undefined} onClick={() => go(i)} />
            </li>
          ))}
        </ol>
        <p className="hm-screen-label" aria-live="polite">
          {index + 1}/{screens.length} {screens[index].label}
        </p>
        {children && <div className="hm-card-actions">{children}</div>}
      </div>
    </>
  );
}
