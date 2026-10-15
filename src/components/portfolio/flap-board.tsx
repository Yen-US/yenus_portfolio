import { cn } from "@/lib/utils";
import { layoutFlapRows } from "@/lib/portfolio-data";

type Line = { text: string; tone?: "paper" | "yellow" };

type FlapBoardProps = {
  lines: Line[];
  cols: number;
  /** Play the one-time arrival flutter. Only the hero board does. */
  animate?: boolean;
  className?: string;
};

/**
 * A split-flap board drawn from real text. The server renders every tile in
 * its final state; the arrival motion is CSS only and gated on
 * `prefers-reduced-motion: no-preference`, so nothing depends on JS.
 *
 * Tiles are presentational. Callers must provide the accessible text next to
 * the board (a heading or visually hidden label).
 */
export function FlapBoard({ lines, cols, animate = false, className }: FlapBoardProps) {
  const rows = lines.flatMap((line) =>
    layoutFlapRows([line.text], cols).map((text) => ({ text, tone: line.tone ?? "paper" }))
  );

  return (
    <div
      aria-hidden="true"
      translate="no"
      className={cn("flapboard", className)}
      data-animate={animate ? "" : undefined}
      style={{ "--cols": cols } as React.CSSProperties}
    >
      {rows.map((row, r) => (
        <div key={r} className="flaprow">
          {Array.from({ length: cols }, (_, c) => {
            const char = row.text[c] ?? " ";
            const ghost = char === " ";
            const i = r * cols + c;
            // Deterministic jitter so the cascade reads mechanical, not random.
            const delay = 120 + r * 140 + c * 26 + ((i * 37) % 7) * 18;
            const flips = 2 + ((i * 11) % 4);
            return (
              <span
                key={c}
                className="flap"
                data-ghost={ghost ? "" : undefined}
                data-tone={row.tone}
                style={{ "--delay": `${delay}ms`, "--flips": flips } as React.CSSProperties}
              >
                {!ghost && (
                  <>
                    <span className="flap-leaf" />
                    <span className="flap-char">{char}</span>
                  </>
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
