"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";

type SubmissionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export function DiscoveryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const preferred = toIsoDateTime(formData.get("preferredDateTime"));
    const alternate = toIsoDateTime(formData.get("alternateDateTime"));

    if (!preferred) {
      setSubmission({ status: "error", message: "Choose a valid preferred time." });
      return;
    }

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      role: formData.get("role"),
      companyStage: formData.get("companyStage"),
      initiativeStage: formData.get("initiativeStage"),
      initiative: formData.get("initiative"),
      investmentRange: formData.get("investmentRange"),
      preferredDateTime: preferred,
      alternateDateTime: alternate ?? "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      consent: formData.get("consent") === "on",
      website: formData.get("website"),
    };

    setSubmission({ status: "idle" });
    startTransition(async () => {
      try {
        const response = await fetch("/api/discovery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(result.error ?? "The request could not be sent.");
        }

        formRef.current?.reset();
        setSubmission({ status: "success" });
      } catch (error) {
        setSubmission({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "The request could not be sent. Please try again.",
        });
      }
    });
  }

  if (submission.status === "success") {
    return (
      <div className="border border-signal/35 bg-signal/5 p-7 md:p-10" role="status">
        <span className="grid h-11 w-11 place-items-center bg-signal text-white">
          <Check className="h-5 w-5" />
        </span>
        <p className="consulting-kicker mt-8 text-signal">Request received</p>
        <h2 className="consulting-display mt-4 text-3xl">Check your inbox.</h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
          You will receive a summary of the requested time. Yenson will review the
          initiative and reply within one business day to confirm the meeting or
          suggest an alternative.
        </p>
        <button
          type="button"
          onClick={() => setSubmission({ status: "idle" })}
          className="focus-ring mt-7 rounded-sm text-sm font-semibold text-signal underline underline-offset-4"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
      <fieldset>
        <legend className="consulting-display text-2xl">About you</legend>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Startup context helps me understand the decision before we meet.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Name" htmlFor="name">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              className="discovery-input"
            />
          </Field>
          <Field label="Work email" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              className="discovery-input"
            />
          </Field>
          <Field label="Company" htmlFor="company">
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              required
              maxLength={120}
              className="discovery-input"
            />
          </Field>
          <Field label="Role" htmlFor="role">
            <input
              id="role"
              name="role"
              type="text"
              autoComplete="organization-title"
              required
              maxLength={120}
              className="discovery-input"
            />
          </Field>
          <Field label="Company stage" htmlFor="companyStage">
            <select id="companyStage" name="companyStage" required className="discovery-input">
              <option value="">Select one</option>
              <option value="Bootstrapped">Bootstrapped</option>
              <option value="Pre-seed">Pre-seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B or later">Series B or later</option>
            </select>
          </Field>
          <Field label="Current stage" htmlFor="initiativeStage">
            <select id="initiativeStage" name="initiativeStage" required className="discovery-input">
              <option value="">Select one</option>
              <option value="Prioritizing opportunities">Prioritizing opportunities</option>
              <option value="Use case selected">Use case selected</option>
              <option value="Prototype or pilot">Prototype or pilot</option>
              <option value="Moving to production">Moving to production</option>
              <option value="Scaling adoption">Scaling adoption</option>
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="border-t border-border pt-10">
        <legend className="consulting-display text-2xl">The initiative</legend>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          No polished brief needed. Describe the outcome, the uncertainty, and why it matters now.
        </p>
        <div className="mt-6 space-y-5">
          <Field label="What are you trying to decide or change?" htmlFor="initiative">
            <textarea
              id="initiative"
              name="initiative"
              required
              minLength={40}
              maxLength={2500}
              rows={7}
              placeholder="For example: We have three possible AI initiatives, but no shared way to compare value, risk, or the architecture each would require..."
              className="discovery-input min-h-40 resize-y py-3"
            />
          </Field>
          <Field
            label="Investment range available if the case is strong"
            htmlFor="investmentRange"
            hint="This is a fit signal, not a quote. Final scope follows discovery."
          >
            <select id="investmentRange" name="investmentRange" required className="discovery-input">
              <option value="">Select one</option>
              <option value="Still evaluating">Still evaluating</option>
              <option value="$10k-$25k">$10k-$25k</option>
              <option value="$25k-$50k">$25k-$50k</option>
              <option value="$50k-$100k">$50k-$100k</option>
              <option value="$100k+">$100k+</option>
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="border-t border-border pt-10">
        <legend className="consulting-display text-2xl">Propose two times</legend>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Times are interpreted in your browser timezone. Your first choice is a
          request and becomes final after email confirmation.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Preferred time" htmlFor="preferredDateTime">
            <input
              id="preferredDateTime"
              name="preferredDateTime"
              type="datetime-local"
              required
              className="discovery-input"
            />
          </Field>
          <Field label="Alternative time" htmlFor="alternateDateTime">
            <input
              id="alternateDateTime"
              name="alternateDateTime"
              type="datetime-local"
              className="discovery-input"
            />
          </Field>
        </div>
      </fieldset>

      <div hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--signal))]"
        />
        <span>
          I agree that Yenson may use these details to evaluate and respond to
          this request. The information is sent by email and is not added to a
          marketing list.
        </span>
      </label>

      {submission.status === "error" ? (
        <p className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {submission.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="focus-ring group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-sm bg-signal px-6 text-sm font-semibold text-white transition-colors hover:bg-foreground disabled:cursor-wait disabled:opacity-65 sm:w-auto"
      >
        {isPending ? (
          <>
            Sending request
            <LoaderCircle className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Request the discovery call
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {hint ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p> : null}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function toIsoDateTime(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}