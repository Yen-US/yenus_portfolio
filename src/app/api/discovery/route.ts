import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { consultant } from "@/lib/consulting-data";

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
  preferredDateTime: z.string().datetime({ offset: true }),
  alternateDateTime: z.union([z.string().datetime({ offset: true }), z.literal("")]),
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

  const preferredDate = new Date(inquiry.preferredDateTime);
  const alternateDate = inquiry.alternateDateTime
    ? new Date(inquiry.alternateDateTime)
    : null;

  if (preferredDate.getTime() < Date.now() + 60 * 60 * 1000) {
    return NextResponse.json(
      { error: "Choose a preferred time at least one hour from now." },
      { status: 400 }
    );
  }

  if (!isValidTimeZone(inquiry.timezone)) {
    return NextResponse.json({ error: "Invalid timezone." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const ownerEmail = process.env.DISCOVERY_NOTIFICATION_EMAIL ?? consultant.email;

  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Discovery email is not configured. Please email Yenson directly." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const preferredForVisitor = formatDate(preferredDate, inquiry.timezone);
  const preferredForOwner = formatDate(preferredDate, "America/Costa_Rica");
  const alternateForVisitor = alternateDate
    ? formatDate(alternateDate, inquiry.timezone)
    : "Not provided";
  const alternateForOwner = alternateDate
    ? formatDate(alternateDate, "America/Costa_Rica")
    : "Not provided";

  const ownerHtml = emailLayout({
    eyebrow: "New discovery request",
    title: `${escapeHtml(inquiry.name)} from ${escapeHtml(inquiry.company)}`,
    intro: "A qualified visitor requested a 30-minute discovery call.",
    rows: [
      ["Name", inquiry.name],
      ["Work email", inquiry.email],
      ["Company / role", `${inquiry.company} · ${inquiry.role}`],
      ["Company stage", inquiry.companyStage],
      ["Initiative stage", inquiry.initiativeStage],
      ["Investment range", inquiry.investmentRange],
      ["Preferred (Costa Rica)", preferredForOwner],
      ["Alternative (Costa Rica)", alternateForOwner],
      ["Visitor timezone", inquiry.timezone],
    ],
    narrativeLabel: "Initiative",
    narrative: inquiry.initiative,
    footer:
      "Reply directly to this email to confirm the meeting or propose another time.",
  });

  const visitorHtml = emailLayout({
    eyebrow: "Discovery request received",
    title: `Thank you, ${escapeHtml(inquiry.name)}.`,
    intro:
      "Your request is in. This is not a confirmed calendar booking yet; Yenson will review the context and reply within one business day.",
    rows: [
      ["Company", inquiry.company],
      ["Preferred time", `${preferredForVisitor} (${inquiry.timezone})`],
      ["Alternative time", alternateForVisitor],
      ["Call length", "30 minutes"],
      ["Investment", "Free discovery conversation"],
    ],
    narrativeLabel: "What you shared",
    narrative: inquiry.initiative,
    footer:
      "You can reply to this email if anything changes or if there is context you want Yenson to see before the call.",
  });

  const { error } = await resend.batch.send([
    {
      from,
      to: [ownerEmail],
      replyTo: inquiry.email,
      subject: `Discovery request · ${sanitizeSubject(inquiry.company)} · ${sanitizeSubject(inquiry.name)}`,
      html: ownerHtml,
    },
    {
      from,
      to: [inquiry.email],
      replyTo: ownerEmail,
      subject: "Your discovery call request with Yenson Umaña",
      html: visitorHtml,
    },
  ]);

  if (error) {
    console.error("Discovery email delivery failed", error);
    return NextResponse.json(
      { error: "The request could not be delivered. Please email Yenson directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
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

function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function formatDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone,
  }).format(date);
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
}: {
  eyebrow: string;
  title: string;
  intro: string;
  rows: [string, string][];
  narrativeLabel: string;
  narrative: string;
  footer: string;
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
          <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #d8d4c8;color:#5d625d;font-size:12px;line-height:1.6;">${escapeHtml(footer)}</p>
        </div>
        <p style="margin:16px 0 0;text-align:center;color:#777d77;font-size:11px;">Yenson Umaña · AI Architecture for Startups · yenus.dev</p>
      </div>
    </body>
  </html>`;
}