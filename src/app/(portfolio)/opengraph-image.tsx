import { ImageResponse } from "next/og";

export const alt = "Yenson Umaña, Senior AI Solution Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rows: { text: string; color: string }[] = [
  { text: "YENSON UMAÑA", color: "#f1f0ec" },
  { text: "SENIOR AI", color: "#ffc61a" },
  { text: "SOLUTION", color: "#ffc61a" },
  { text: "ARCHITECT", color: "#ffc61a" },
];
const COLS = 14;

/** The social card is the hero board, drawn as static tiles. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0c0c0d",
          padding: 56,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "#141416", padding: 18 }}>
          {rows.map((row) => (
            <div key={row.text} style={{ display: "flex", gap: 6 }}>
              {Array.from({ length: COLS }, (_, i) => {
                const ch = row.text[i] ?? " ";
                return (
                  <div
                    key={i}
                    style={{
                      width: 72,
                      height: 96,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: ch === " " ? "#18181a" : "#1f1f22",
                      color: row.color,
                      fontSize: 68,
                      fontWeight: 700,
                      borderRadius: 3,
                    }}
                  >
                    {ch === " " ? "" : ch}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", marginTop: 26, color: "#a6a6ad", fontSize: 28 }}>
          Production agentic AI / Azure migrations / yenus.dev
        </div>
      </div>
    ),
    size
  );
}
