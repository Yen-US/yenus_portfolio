import type { Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { cn } from "@/lib/utils";

/** One family, one file: optical size and width axes carry display and reading. */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-home",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0e0f10",
};

/**
 * The homepage runs in its own visual world, "home", scoped by this wrapper.
 * The CV at `/cv` keeps the station world and the consulting pages keep theirs.
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn("home min-h-screen", bricolage.variable)}>{children}</div>;
}
