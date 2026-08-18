import type { Metadata } from "next";
import { LoginForm } from "@/components/signal-room/login-form";

export const metadata: Metadata = {
  title: "Signal Room",
  robots: { index: false, follow: false, nocache: true },
};

export default function SignalRoomLoginPage() {
  return (
    <main className="consulting-shell grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center bg-signal font-mono text-[10px] font-semibold text-white">
            SR
          </span>
          <div>
            <p className="text-sm font-semibold">Signal Room</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Private ops
            </p>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
