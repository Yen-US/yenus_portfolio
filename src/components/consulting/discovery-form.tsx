"use client";

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  Globe2,
  LoaderCircle,
} from "lucide-react";
import {
  COSTA_RICA_TIME_ZONE,
  DISCOVERY_DURATION_MINUTES,
  createDiscoverySlotStart,
  formatDiscoveryDate,
  formatDiscoveryTime,
  getAvailableDiscoveryDates,
  getAvailableDiscoveryHours,
  type DiscoverySlotHour,
} from "@/lib/discovery-schedule";

interface BookingConfirmation {
  startsAt: string;
  endsAt: string;
  visitorTimeZone: string;
  visitorLabel: string;
  costaRicaLabel: string;
  meetingUrl: string;
  googleCalendarUrl: string;
}

type SubmissionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; booking: BookingConfirmation };

type AvailabilityState = "loading" | "ready" | "error";

export function DiscoveryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();
  const [visitorTimeZone, setVisitorTimeZone] = useState("UTC");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState<DiscoverySlotHour | null>(null);
  const [bookedStarts, setBookedStarts] = useState<Set<string>>(new Set());
  const [availabilityState, setAvailabilityState] =
    useState<AvailabilityState>("loading");

  useEffect(() => {
    const detected =
      Intl.DateTimeFormat().resolvedOptions().timeZone || COSTA_RICA_TIME_ZONE;
    const dates = getAvailableDiscoveryDates();
    setVisitorTimeZone(detected);
    setAvailableDates(dates);
    setSelectedDate(dates[0] ?? "");

    let cancelled = false;
    async function loadAvailability() {
      try {
        const response = await fetch("/api/discovery/availability", {
          cache: "no-store",
        });
        const result = (await response.json()) as {
          error?: string;
          bookedStarts?: string[];
        };
        if (!response.ok || !result.bookedStarts) {
          throw new Error(result.error ?? "Availability could not be loaded.");
        }
        if (!cancelled) {
          setBookedStarts(new Set(result.bookedStarts));
          setAvailabilityState("ready");
        }
      } catch {
        if (!cancelled) setAvailabilityState("error");
      }
    }
    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableHours = selectedDate
    ? getAvailableDiscoveryHours(selectedDate)
    : [];
  const timeZoneOptions = getTimeZoneOptions(visitorTimeZone);

  useEffect(() => {
    if (!selectedDate || selectedHour === null) return;
    if (isBookedSlot(selectedDate, selectedHour, bookedStarts)) {
      setSelectedHour(null);
    }
  }, [bookedStarts, selectedDate, selectedHour]);

  useEffect(() => {
    if (availabilityState !== "ready" || !selectedDate) return;
    const selectedHours = getAvailableDiscoveryHours(selectedDate);
    if (
      selectedHours.length > 0 &&
      selectedHours.every((hour) =>
        isBookedSlot(selectedDate, hour, bookedStarts)
      )
    ) {
      const nextDate = availableDates.find((dateKey) =>
        getAvailableDiscoveryHours(dateKey).some(
          (hour) => !isBookedSlot(dateKey, hour, bookedStarts)
        )
      );
      setSelectedDate(nextDate ?? "");
      setSelectedHour(null);
    }
  }, [availabilityState, availableDates, bookedStarts, selectedDate]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!selectedDate || selectedHour === null) {
      setSubmission({ status: "error", message: "Choose a date and time for the call." });
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
      slotDate: selectedDate,
      slotHour: selectedHour,
      timezone: visitorTimeZone,
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
        const result = (await response.json()) as {
          error?: string;
          bookedStart?: string;
          booking?: BookingConfirmation;
        };

        if (!response.ok || !result.booking) {
          if (response.status === 409 && result.bookedStart) {
            setBookedStarts((current) => {
              const next = new Set(current);
              next.add(result.bookedStart!);
              return next;
            });
            setSelectedHour(null);
          }
          throw new Error(result.error ?? "The request could not be sent.");
        }

        formRef.current?.reset();
        setSubmission({ status: "success", booking: result.booking });
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
    const { booking } = submission;
    return (
      <div className="border border-signal/35 bg-signal/5 p-7 md:p-10" role="status">
        <span className="grid h-11 w-11 place-items-center bg-signal text-white">
          <Check className="h-5 w-5" />
        </span>
        <p className="consulting-kicker mt-8 text-signal">Meeting confirmed</p>
        <h2 className="consulting-display mt-4 text-3xl">You are on the calendar.</h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
          A calendar invitation has been emailed to you and Yenson. No additional
          confirmation is required.
        </p>
        <dl className="mt-7 border-y border-signal/20 py-5">
          <div className="grid gap-1 sm:grid-cols-[140px_1fr]">
            <dt className="text-xs font-semibold text-muted-foreground">Your time</dt>
            <dd className="text-sm font-semibold">{booking.visitorLabel}</dd>
          </div>
          <div className="mt-4 grid gap-1 sm:grid-cols-[140px_1fr]">
            <dt className="text-xs font-semibold text-muted-foreground">Costa Rica</dt>
            <dd className="text-sm">{booking.costaRicaLabel}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={booking.meetingUrl}
            target="_blank"
            rel="noopener"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-signal px-5 text-sm font-semibold text-white hover:bg-foreground"
          >
            Join meeting
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={booking.googleCalendarUrl}
            target="_blank"
            rel="noopener"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-border bg-background px-5 text-sm font-semibold hover:border-foreground"
          >
            Add to Google Calendar
            <CalendarDays className="h-4 w-4" />
          </a>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedHour(null);
            setSubmission({ status: "idle" });
          }}
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
        <legend className="consulting-display text-2xl">Choose a time</legend>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {DISCOVERY_DURATION_MINUTES}-minute call. Starts are offered every hour,
          Monday through Friday, from 10:00 AM to 5:00 PM Costa Rica.
        </p>

        <div className="mt-6 flex min-w-0 items-center gap-3 border border-signal/25 bg-signal/5 p-4">
          <Globe2 className="h-5 w-5 shrink-0 text-signal" />
          <label className="min-w-0 flex-1 text-xs font-semibold" htmlFor="visitorTimeZone">
            Times shown in
            <select
              id="visitorTimeZone"
              value={visitorTimeZone}
              onChange={(event) => setVisitorTimeZone(event.target.value)}
              className="mt-1 block w-full min-w-0 max-w-full border-0 bg-transparent font-mono text-xs text-signal outline-none sm:ml-2 sm:mt-0 sm:inline-block sm:w-auto"
            >
              {timeZoneOptions.map((timeZone) => (
                <option key={timeZone} value={timeZone}>
                  {formatTimeZoneLabel(timeZone)}
                </option>
              ))}
            </select>
          </label>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            {availabilityState === "loading"
              ? "Checking"
              : availabilityState === "ready"
                ? "Live"
                : "Rechecked on booking"}
          </span>
        </div>

        <div className="mt-7">
          <p className="flex items-center gap-2 text-xs font-semibold">
            <CalendarDays className="h-4 w-4 text-signal" />
            Select a date
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {availableDates.map((dateKey) => {
              const firstHour = getAvailableDiscoveryHours(dateKey)[0] ?? 10;
              const start = createDiscoverySlotStart(dateKey, firstHour);
              if (!start) return null;
              const localDate = formatDiscoveryDate(start, visitorTimeZone);
              const costaRicaDate = formatDiscoveryDate(
                start,
                COSTA_RICA_TIME_ZONE
              );
              const selected = selectedDate === dateKey;
              const dateHours = getAvailableDiscoveryHours(dateKey);
              const fullyBooked =
                dateHours.length === 0 ||
                dateHours.every((hour) =>
                  isBookedSlot(dateKey, hour, bookedStarts)
                );

              return (
                <button
                  key={dateKey}
                  type="button"
                  data-date-key={dateKey}
                  aria-pressed={selected}
                  disabled={fullyBooked}
                  onClick={() => {
                    setSelectedDate(dateKey);
                    setSelectedHour(null);
                    setSubmission({ status: "idle" });
                  }}
                  className={`focus-ring min-h-16 rounded-sm border px-3 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                    selected
                      ? "border-signal bg-signal text-white"
                      : "border-border bg-background hover:border-signal"
                  }`}
                >
                  <span className="block text-sm font-semibold">{localDate}</span>
                  {localDate !== costaRicaDate ? (
                    <span
                      className={`mt-1 block text-[10px] ${
                        selected ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      {costaRicaDate} in Costa Rica
                    </span>
                  ) : null}
                  {fullyBooked ? (
                    <span className="mt-1 block text-[10px] text-muted-foreground">
                      Fully booked
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {selectedDate ? (
          <div className="mt-7">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <Clock3 className="h-4 w-4 text-signal" />
              Select a start time
            </p>
            <div
              role="radiogroup"
              aria-label="Discovery call start time"
              className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {availableHours.map((hour) => {
                const start = createDiscoverySlotStart(selectedDate, hour);
                if (!start) return null;
                const selected = selectedHour === hour;
                const booked = isBookedSlot(
                  selectedDate,
                  hour,
                  bookedStarts
                );

                return (
                  <button
                    key={hour}
                    type="button"
                    data-slot-hour={hour}
                    role="radio"
                    aria-checked={selected}
                    disabled={booked}
                    onClick={() => {
                      setSelectedHour(hour);
                      setSubmission({ status: "idle" });
                    }}
                    className={`focus-ring min-h-16 rounded-sm border px-3 py-2 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                      selected
                        ? "border-signal bg-signal text-white"
                        : "border-border bg-background hover:border-signal"
                    }`}
                  >
                    <span className="block text-base font-semibold">
                      {formatDiscoveryTime(start, visitorTimeZone)}
                    </span>
                    <span
                      className={`mt-1 block text-[10px] ${
                        selected ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      {booked
                        ? "Booked"
                        : `${formatDiscoveryTime(start, COSTA_RICA_TIME_ZONE)} CR`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {selectedDate && selectedHour !== null ? (
          <SelectedSlotSummary
            dateKey={selectedDate}
            hour={selectedHour}
            visitorTimeZone={visitorTimeZone}
          />
        ) : null}
      </fieldset>

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
            Confirm the discovery call
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

function SelectedSlotSummary({
  dateKey,
  hour,
  visitorTimeZone,
}: {
  dateKey: string;
  hour: DiscoverySlotHour;
  visitorTimeZone: string;
}) {
  const start = createDiscoverySlotStart(dateKey, hour);
  if (!start) return null;

  return (
    <div className="mt-5 border-l-2 border-signal bg-secondary/50 px-4 py-3">
      <p className="text-xs font-semibold">Selected</p>
      <p className="mt-1 text-sm">
        {formatDiscoveryDate(start, visitorTimeZone)} at{" "}
        {formatDiscoveryTime(start, visitorTimeZone)}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {formatDiscoveryDate(start, COSTA_RICA_TIME_ZONE)} at{" "}
        {formatDiscoveryTime(start, COSTA_RICA_TIME_ZONE)} Costa Rica
      </p>
    </div>
  );
}

function getTimeZoneOptions(detected: string) {
  try {
    const supported = Intl.supportedValuesOf("timeZone");
    return supported.includes(detected)
      ? supported
      : [detected, ...supported];
  } catch {
    return Array.from(
      new Set([
        detected,
        COSTA_RICA_TIME_ZONE,
        "America/Los_Angeles",
        "America/Denver",
        "America/Chicago",
        "America/New_York",
        "Europe/London",
        "Europe/Madrid",
        "Asia/Tokyo",
      ])
    );
  }
}

function formatTimeZoneLabel(timeZone: string) {
  return timeZone.replace(/_/g, " ");
}

function isBookedSlot(
  dateKey: string,
  hour: DiscoverySlotHour,
  bookedStarts: Set<string>
) {
  const start = createDiscoverySlotStart(dateKey, hour);
  return start ? bookedStarts.has(start.toISOString()) : true;
}