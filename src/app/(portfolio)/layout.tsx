import type { Viewport } from "next";
import { Barlow, Big_Shoulders } from "next/font/google";
import { cn } from "@/lib/utils";

const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-station-display",
  display: "swap",
});

const body = Barlow({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-station-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0c0c0d",
};

/**
 * The portfolio (`/`, `/cv`) runs in its own visual world, "station", scoped
 * by this wrapper so the consulting pages keep theirs untouched.
 */
export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("station min-h-screen", display.variable, body.variable)}>
      {children}
    </div>
  );
}
