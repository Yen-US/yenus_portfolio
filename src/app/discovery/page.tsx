import type { Metadata } from "next";
import { Clock3, MailCheck, ShieldCheck } from "lucide-react";
import { DiscoveryForm } from "@/components/consulting/discovery-form";
import {
  ConsultingFooter,
  ConsultingHeader,
} from "@/components/consulting/site-chrome";
import { consultant } from "@/lib/consulting-data";

export const metadata: Metadata = {
  title: "Book a Discovery Call",
  description:
    "Book a confirmed 30-minute conversation with Yenson Umaña about your startup's AI product, architecture, or path to production.",
};

const fitSignals = [
  "A founder, CTO, or technical lead is close to the decision.",
  "Your team has a real AI product idea, prototype, or production constraint.",
  "You need a clear path and independent judgment, not another tool pitch.",
];

export default function DiscoveryPage() {
  return (
    <div className="consulting-shell min-h-screen bg-background text-foreground">
      <ConsultingHeader />
      <main>
        <section className="border-b border-border bg-foreground py-14 text-background md:py-20">
          <div className="consulting-container grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="consulting-kicker text-brass-soft">Free · 30 minutes · No deck required</p>
              <h1 className="consulting-display mt-6 max-w-4xl text-5xl leading-[1.02] md:text-7xl">
                Book a discovery call.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-background/70">
                Bring the AI idea, prototype, or architecture decision your team
                cannot yet turn into a production path. We will clarify what is
                actually uncertain and whether working together is the right move.
              </p>
            </div>
            <p className="border-l border-background/25 pl-6 text-sm leading-6 text-background/55">
              Choose a time and receive the calendar invitation immediately.
              This is a founder-level fit conversation, not free consulting and
              not a scripted pitch.
            </p>
          </div>
        </section>

        <section className="consulting-section">
          <div className="consulting-container grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div className="lg:order-2 border border-border bg-card p-6 md:p-10">
              <DiscoveryForm />
            </div>

            <aside className="lg:order-1 lg:sticky lg:top-28 lg:self-start">
              <p className="consulting-kicker text-signal">Before you book</p>
              <h2 className="consulting-display mt-5 text-3xl leading-10">
                The best startup conversations start before the path looks obvious.
              </h2>

              <div className="mt-8 space-y-5 border-y border-border py-6">
                {fitSignals.map((signal) => (
                  <p key={signal} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal" />
                    {signal}
                  </p>
                ))}
              </div>

              <div className="mt-8 space-y-5">
                <CallDetail icon={Clock3} title="30 minutes" body="Focused on context, stakes, and fit." />
                <CallDetail icon={MailCheck} title="Instantly confirmed" body="Choose a fixed Costa Rica slot and receive an email invitation immediately." />
                <CallDetail icon={ShieldCheck} title="Handled privately" body="No newsletter signup and no resale of your information." />
              </div>

              <p className="mt-8 text-sm leading-6 text-muted-foreground">
                Prefer email? Write directly to{" "}
                <a href={`mailto:${consultant.email}`} className="font-semibold text-signal underline underline-offset-4">
                  {consultant.email}
                </a>
                .
              </p>
            </aside>
          </div>
        </section>
      </main>
      <ConsultingFooter />
    </div>
  );
}

function CallDetail({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Clock3;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-signal" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}