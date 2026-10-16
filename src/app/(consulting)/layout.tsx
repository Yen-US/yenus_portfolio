import type { Metadata } from "next";

/**
 * The consulting practice (`/consulting`, `/services`, `/work`, `/about`,
 * `/discovery`) keeps the social card it had when it lived at `/`. The route
 * group changes no URLs; it only scopes this metadata away from the portfolio.
 */
export const metadata: Metadata = {
  openGraph: {
    title: "Yenson Umaña · AI Architecture for Startups",
    description:
      "From AI ambition to production clarity for founders, CTOs, and lean startup teams.",
    siteName: "Yenson Umaña",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Yenson Umaña · AI Architecture for Startups",
    description:
      "From AI ambition to production clarity for founders, CTOs, and lean startup teams.",
  },
};

export default function ConsultingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
