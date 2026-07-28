import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { Resend } from "resend";
import { z } from "zod";
import { consultant } from "@/lib/consulting-data";
import {
  COSTA_RICA_TIME_ZONE,
  DISCOVERY_DURATION_MINUTES,
  DISCOVERY_SLOT_HOURS,
  createDiscoverySlotStart,
  formatDiscoveryDateTime,
  getDiscoverySlotEnd,
  isDiscoverySlotBookable,
  isValidTimeZone,
  type DiscoverySlotHour,
} from "@/lib/discovery-schedule";
import {
  createDiscoveryCalendarInvite,
  createGoogleCalendarUrl,
} from "@/lib/discovery-calendar";

const discoverySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  companyStage: z.enum([
    "Bootstrapped",
    "Pre-seed",
    "Seed",
    "Series A",
    "Series B or later",
  ]),
  initiativeStage: z.enum([
    "Prioritizing opportunities",
    "Use case selected",
    "Prototype or pilot",
    "Moving to production",
    "Scaling adoption",
  ]),
  initiative: z.string().trim().min(40).max(2500),
  investmentRange: z.enum([
    "Still evaluating",
    "$10k-$25k",
    "$25k-$50k",
    "$50k-$100k",
    "$100k+",
  ]),
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotHour: z
    .number()
    .int()
    .refine((value) =>
      DISCOVERY_SLOT_HOURS.includes(value as DiscoverySlotHour)
    ),
  timezone: z.string().trim().min(1).max(100),
  consent: z.literal(true),
  website: z.string().max(200).optional().default(""),
});

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  const rateLimitKey = getRateLimitKey(request);
  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = discoverySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Review the form and complete every required field." },
      { status: 400 }
    );
  }

  const inquiry = parsed.data;
  if (inquiry.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const slotStart = createDiscoverySlotStart(
    inquiry.slotDate,
    inquiry.slotHour
  );
  if (!slotStart || !isDiscoverySlotBookable(slotStart)) {
    return NextResponse.json(
      {
        error:
          "That time is no longer bookable. Choose another weekday slot between 10:00 AM and 5:00 PM Costa Rica.",
      },
      { status: 400 }
    );
  }

  if (!isValidTimeZone(inquiry.timezone)) {
    return NextResponse.json({ error: "Invalid timezone." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const ownerEmail = process.env.DISCOVERY_NOTIFICATION_EMAIL ?? consultant.email;
  const meetingUrl = getMeetingUrl();

  if (!apiKey || !from || !meetingUrl) {
    return NextResponse.json(
      {
        error:
          "Instant booking is not configured yet. Please email Yenson directly.",
      },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const slotEnd = getDiscoverySlotEnd(slotStart);
  const visitorLabel = formatDiscoveryDateTime(slotStart, inquiry.timezone);
  const costaRicaLabel = formatDiscoveryDateTime(
    slotStart,
    COSTA_RICA_TIME_ZONE
  );
  const bookingKey = createHash("sha256")
    .update(`${inquiry.email.toLowerCase()}|${slotStart.toISOString()}`)
    .digest("hex")
    .slice(0, 32);
  const organizerEmail = extractEmailAddress(from);
  const calendarInvite = createDiscoveryCalendarInvite({
    uid: `${bookingKey}@yenus.dev`,
    start: slotStart,
    attendeeName: inquiry.name,
    attendeeEmail: inquiry.email,
    ownerEmail,
    organizerEmail,
    meetingUrl,
    company: inquiry.company,
  });
  const calendarAttachment = {
    filename: "yenson-umana-discovery-call.ics",
    content: Buffer.from(calendarInvite, "utf8").toString("base64"),
    contentType: "text/calendar; charset=utf-8; method=REQUEST",
  };
  const googleCalendarUrl = createGoogleCalendarUrl({
    start: slotStart,
    meetingUrl,
    attendeeName: inquiry.name,
    company: inquiry.company,
  });

  const ownerHtml = emailLayout({
    eyebrow: "Discovery call confirmed",
    title: `${escapeHtml(inquiry.name)} from ${escapeHtml(inquiry.company)}`,
    intro: "A visitor booked an available 30-minute discovery slot.",
    rows: [
      ["Name", inquiry.name],
      ["Work email", inquiry.email],
      ["Company / role", `${inquiry.company} · ${inquiry.role}`],
      ["Company stage", inquiry.companyStage],
      ["Initiative stage", inquiry.initiativeStage],
      ["Investment range", inquiry.investmentRange],
      ["Costa Rica time", costaRicaLabel],
      ["Visitor time", `${visitorLabel} (${inquiry.timezone})`],
      ["Duration", `${DISCOVERY_DURATION_MINUTES} minutes`],
      ["Visitor timezone", inquiry.timezone],
    ],
    narrativeLabel: "Initiative",
    narrative: inquiry.initiative,
    footer: "The attached calendar invitation uses the same event UID sent to the visitor.",
    cta: { label: "Open meeting", url: meetingUrl },
  });

  const visitorHtml = emailLayout({
    eyebrow: "Discovery call confirmed",
    title: `You are booked, ${escapeHtml(inquiry.name)}.`,
    intro:
      "Your time is confirmed. No additional approval is required, and a calendar invitation is attached.",
    rows: [
      ["Company", inquiry.company],
      ["Your time", `${visitorLabel} (${inquiry.timezone})`],
      ["Costa Rica time", costaRicaLabel],
      ["Call length", `${DISCOVERY_DURATION_MINUTES} minutes`],
      ["Investment", "Free discovery conversation"],
    ],
    narrativeLabel: "What you shared",
    narrative: inquiry.initiative,
    footer:
      "Reply to this email if anything changes or if there is context Yenson should see before the call.",
    cta: { label: "Join meeting", url: meetingUrl },
  });

  const [ownerDelivery, visitorDelivery] = await Promise.all([
    resend.emails.send(
      {
      from,
      to: [ownerEmail],
      replyTo: inquiry.email,
      subject: `Confirmed discovery call · ${sanitizeSubject(inquiry.company)} · ${sanitizeSubject(inquiry.name)}`,
      html: ownerHtml,
      text: createPlainTextEmail({
        title: `Discovery call confirmed with ${inquiry.name}`,
        time: costaRicaLabel,
        meetingUrl,
        narrative: inquiry.initiative,
      }),
      attachments: [calendarAttachment],
      headers: { "X-Entity-Ref-ID": bookingKey },
      },
      { idempotencyKey: `discovery-owner-${bookingKey}` }
    ),
    resend.emails.send(
      {
      from,
      to: [inquiry.email],
      replyTo: ownerEmail,
      subject: "Confirmed: your discovery call with Yenson Umaña",
      html: visitorHtml,
      text: createPlainTextEmail({
        title: "Your discovery call with Yenson Umaña is confirmed",
        time: `${visitorLabel} (${inquiry.timezone})`,
        meetingUrl,
        narrative: inquiry.initiative,
      }),
      attachments: [calendarAttachment],
      headers: { "X-Entity-Ref-ID": bookingKey },
      },
      { idempotencyKey: `discovery-visitor-${bookingKey}` }
    ),
  ]);

  const deliveryError = ownerDelivery.error ?? visitorDelivery.error;
  if (deliveryError) {
    console.error("Discovery email delivery failed", deliveryError);
    return NextResponse.json(
      { error: "The request could not be delivered. Please email Yenson directly." },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      booking: {
        startsAt: slotStart.toISOString(),
        endsAt: slotEnd.toISOString(),
        visitorTimeZone: inquiry.timezone,
        visitorLabel,
        costaRicaLabel,
        meetingUrl,
        googleCalendarUrl,
      },
    },
    { status: 201 }
  );
}

function getRateLimitKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous"
  );
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }

  current.count += 1;
  return true;
}

function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return process.env.NODE_ENV !== "production";
  }

  const allowedOrigins = new Set([new URL(request.url).origin]);
  const configuredSite = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredSite) {
    allowedOrigins.add(new URL(configuredSite).origin);
  }

  return allowedOrigins.has(origin);
}

function sanitizeSubject(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, 100);
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character
  );
}

function emailLayout({
  eyebrow,
  title,
  intro,
  rows,
  narrativeLabel,
  narrative,
  footer,
  cta,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  rows: [string, string][];
  narrativeLabel: string;
  narrative: string;
  footer: string;
  cta?: { label: string; url: string };
}) {
  const rowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #d8d4c8;color:#5d625d;font-size:12px;vertical-align:top;width:34%;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #d8d4c8;color:#171a17;font-size:13px;line-height:1.5;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  return `<!doctype html>
  <html lang="en">
    <body style="margin:0;background:#f4f2ea;color:#171a17;font-family:Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;padding:40px 20px;">
        <div style="background:#fbfaf6;border:1px solid #d8d4c8;padding:32px;">
          <p style="margin:0;color:#245345;font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
          <h1 style="margin:16px 0 0;font-family:Georgia,serif;font-size:30px;font-weight:400;line-height:1.15;">${title}</h1>
          <p style="margin:16px 0 0;color:#5d625d;font-size:14px;line-height:1.65;">${escapeHtml(intro)}</p>
          <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:28px;border-top:1px solid #171a17;">${rowsHtml}</table>
          <p style="margin:28px 0 8px;color:#245345;font-size:10px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;">${escapeHtml(narrativeLabel)}</p>
          <p style="margin:0;white-space:pre-wrap;color:#333833;font-size:14px;line-height:1.65;">${escapeHtml(narrative)}</p>
          ${cta ? `<p style="margin:28px 0 0;"><a href="${escapeHtml(cta.url)}" style="display:inline-block;background:#245345;color:#ffffff;text-decoration:none;padding:12px 18px;font-size:13px;font-weight:700;">${escapeHtml(cta.label)}</a></p>` : ""}
          <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #d8d4c8;color:#5d625d;font-size:12px;line-height:1.6;">${escapeHtml(footer)}</p>
        </div>
        <p style="margin:16px 0 0;text-align:center;color:#777d77;font-size:11px;">Yenson Umaña · AI Architecture for Startups · yenus.dev</p>
      </div>
    </body>
  </html>`;
}

function getMeetingUrl() {
  const value = process.env.DISCOVERY_MEETING_URL;
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function extractEmailAddress(value: string) {
  const bracketed = value.match(/<([^>]+)>/)?.[1];
  return (bracketed ?? value).trim().toLowerCase();
}

function createPlainTextEmail({
  title,
  time,
  meetingUrl,
  narrative,
}: {
  title: string;
  time: string;
  meetingUrl: string;
  narrative: string;
}) {
  return `${title}\n\nTime: ${time}\nDuration: ${DISCOVERY_DURATION_MINUTES} minutes\nMeeting: ${meetingUrl}\n\nInitiative:\n${narrative}\n\nA calendar invitation is attached.`;
}