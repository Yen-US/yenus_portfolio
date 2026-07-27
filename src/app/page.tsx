import type { Metadata } from "next";
import { ConsultingHome } from "@/components/consulting/consulting-home";

export const metadata: Metadata = {
  title: "AI Architecture for Startups",
  description:
    "Yenson Umaña helps founders and CTOs turn ambitious AI ideas into clear decisions, production-ready architecture, and a path their team can execute.",
};

export default function Home() {
  return <ConsultingHome />;
}
