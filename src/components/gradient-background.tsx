"use client";

export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base surface */}
      <div className="absolute inset-0 bg-background" />

      {/* Light mode — warm wash, single radial */}
      <div className="absolute inset-0 dark:hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px circle at 20% 0%, hsl(36 45% 75% / 0.35), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(700px circle at 90% 30%, hsl(42 60% 80% / 0.25), transparent 55%)",
          }}
        />
      </div>

      {/* Dark mode — deep warm void with brass highlights */}
      <div className="absolute inset-0 hidden dark:block">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px circle at 15% -10%, hsl(36 60% 18% / 0.55), transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px circle at 85% 20%, hsl(28 50% 14% / 0.5), transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(700px circle at 50% 100%, hsl(42 70% 22% / 0.3), transparent 60%)",
          }}
        />
      </div>

      {/* Grain — printed-paper feel */}
      <div
        className="absolute inset-0 opacity-[0.07] motion-reduce:hidden"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
        }}
      />

      {/* Vignette at top edge for depth */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass/40 to-transparent" />
    </div>
  );
}
