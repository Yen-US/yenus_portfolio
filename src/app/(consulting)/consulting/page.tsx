import type { Metadata } from "next";
import { ConsultingHome } from "@/components/consulting/consulting-home";

export const metadata: Metadata = {
  alternates: { canonical: "/consulting" },
  title: { absolute: "AI Architecture & Technical Strategy for Startups" },
  description:
    "Yenson Umaña helps startup founders and CTOs make consequential AI and architecture decisions while the path is still open, then turns them into a production path their team can own.",
};

export default function ConsultingPage() {
  return <ConsultingHome />;
}
