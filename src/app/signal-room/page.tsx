import type { Metadata } from "next";
import { SignalRoomApp } from "@/components/signal-room/signal-room-app";
import { getWorkspaceData } from "@/lib/signal-room/store";
import { getLedgerData } from "@/lib/signal-room/ledger-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal Room",
  description: "Private startup research and LinkedIn content workspace.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SignalRoomPage() {
  // Loaded in parallel: the ledger lives in its own tables and neither query
  // depends on the other.
  const [initialData, ledger] = await Promise.all([
    getWorkspaceData(),
    getLedgerData(),
  ]);
  return <SignalRoomApp initialData={initialData} ledger={ledger} />;
}