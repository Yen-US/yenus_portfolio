import type { Metadata } from "next";
import { SignalRoomApp } from "@/components/signal-room/signal-room-app";
import { getWorkspaceData } from "@/lib/signal-room/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal Room",
  description: "Private startup research and LinkedIn content workspace.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SignalRoomPage() {
  const initialData = await getWorkspaceData();
  return <SignalRoomApp initialData={initialData} />;
}