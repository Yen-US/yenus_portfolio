import { ImageResponse } from "next/og";

export const alt = "Customer-acquisition work by Yenson Umaña through Presencia Studio: Guanacaste Earthmoving and JR Rodríguez.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0e0f10";
const INK = "#f3f1ec";
const MUTED = "#a4a49d";

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800&display=swap", {
      headers: { "User-Agent": "Mozilla/4.0" },
    }).then((r) => r.text());
    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"](?:truetype|opentype)['"]\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const font = await loadFont();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: BG, color: INK, padding: 56, ...(font ? { fontFamily: "Bricolage Grotesque" } : {}) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>Yenson Umaña</div>
          <div style={{ display: "flex", fontSize: 26, color: MUTED }}>Client work through Presencia Studio</div>
        </div>
        <div style={{ display: "flex", marginTop: 22, fontSize: 30, color: MUTED }}>Customer-acquisition systems, built and operated</div>
        <div style={{ display: "flex", flex: 1, gap: 20, marginTop: 28 }}>
          <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", padding: 36, borderRadius: 28, background: "#2a1409", color: "#f6efe1" }}>
            <div style={{ display: "flex", fontSize: 54, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2 }}>Guanacaste Earthmoving</div>
            <div style={{ display: "flex", fontSize: 24 }}>Bilingual site, two taps to WhatsApp</div>
          </div>
          <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", padding: 36, borderRadius: 28, background: "#f4f0e6", color: "#17181a" }}>
            <div style={{ display: "flex", fontSize: 54, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2 }}>JR Rodríguez</div>
            <div style={{ display: "flex", fontSize: 24 }}>Commission page, inquiry inbox, Facebook</div>
          </div>
        </div>
      </div>
    ),
    font ? { ...size, fonts: [{ name: "Bricolage Grotesque", data: font, weight: 800 as const, style: "normal" as const }] } : size
  );
}
