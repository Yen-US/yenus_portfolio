import type { Viewport } from "next";
import { Archivo } from "next/font/google";
import { cn } from "@/lib/utils";

/**
 * One family, two widths. Archivo's width axis carries the whole display
 * voice (expanded for headings, normal for reading), so the page ships a
 * single font file.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sheet",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#f2f3f0",
};

/**
 * The recruiter portfolio at `/` runs in its own visual world, "sheet", scoped
 * by this wrapper. The CV at `/cv` keeps the station world and the consulting
 * pages keep theirs.
 */
export default function SheetLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn("sheet min-h-screen", archivo.variable)}>{children}</div>;
}
