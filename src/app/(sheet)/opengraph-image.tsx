import { ImageResponse } from "next/og";

export const alt = "Yenson Umaña, Senior AI Solution Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f2f3f0";
const INK = "#121315";
const GRAPHITE = "#55585e";
const MARKER = "#ff4a00";

/**
 * Loads Archivo 800 as a static TTF for the social card. The site itself
 * self-hosts the font through next/font; this route renders once at build.
 * If the fetch fails the card falls back to the renderer's default face.
 */
async function loadArchivo(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Archivo:wght@800&display=swap",
      { headers: { "User-Agent": "Mozilla/4.0" } }
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"](?:truetype|opentype)['"]\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

/** The social card is the sheet's title block. */
export default async function OpengraphImage() {
  const archivo = await loadArchivo();
  const family = archivo ? "Archivo" : undefined;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          color: INK,
          padding: 48,
          ...(family ? { fontFamily: family } : {}),
        }}
      >
        <div style={{ display: "flex", flex: 1, border: `3px solid ${INK}` }}>
          <div style={{ display: "flex", flex: 1.3, flexDirection: "column", justifyContent: "space-between", padding: 44, borderRight: `3px solid ${INK}` }}>
            <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4 }}>
              Production AI, drawn to scale.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: GRAPHITE }}>
              <div style={{ width: 120, height: 3, background: INK }} />
              Jan 2021 to Oct 2026
            </div>
          </div>
          <div style={{ display: "flex", flex: 0.9, flexDirection: "column", justifyContent: "space-between", padding: 40 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 54, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2, textTransform: "uppercase" }}>
                Yenson Umaña
              </div>
              <div style={{ display: "flex", marginTop: 16, fontSize: 28, fontWeight: 600 }}>Senior AI Solution Architect</div>
              <div style={{ display: "flex", marginTop: 26, paddingTop: 12, borderTop: `1px solid ${INK}`, fontSize: 22, color: GRAPHITE }}>
                Costa Rica, works remotely
              </div>
              <div style={{ display: "flex", paddingTop: 10, marginTop: 10, borderTop: `1px solid ${INK}`, fontSize: 22, color: GRAPHITE }}>
                AI-102, AZ-204
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, padding: "0 22px", background: MARKER, fontSize: 26, fontWeight: 700 }}>
              <span>yenus.dev</span>
              <span>CV</span>
            </div>
          </div>
        </div>
      </div>
    ),
    archivo
      ? { ...size, fonts: [{ name: "Archivo", data: archivo, weight: 800 as const, style: "normal" as const }] }
      : size
  );
}
