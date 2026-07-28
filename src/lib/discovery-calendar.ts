import "server-only";

import { getDiscoverySlotEnd } from "@/lib/discovery-schedule";

interface CalendarInviteInput {
  uid: string;
  start: Date;
  attendeeName: string;
  attendeeEmail: string;
  ownerEmail: string;
  organizerEmail: string;
  meetingUrl: string;
  company: string;
}

export function createDiscoveryCalendarInvite(input: CalendarInviteInput) {
  const end = getDiscoverySlotEnd(input.start);
  const createdAt = new Date();
  const description = [
    `Discovery conversation with ${input.attendeeName} from ${input.company}.`,
    "Context and qualification details are in the confirmation email.",
    `Join: ${input.meetingUrl}`,
  ].join("\n\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "PRODID:-//Yenson Umana//Discovery Call//EN",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "X-WR-CALNAME:Yenson Umana Discovery Call",
    "X-WR-TIMEZONE:America/Costa_Rica",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(input.uid)}`,
    `DTSTAMP:${formatIcsUtc(createdAt)}`,
    `CREATED:${formatIcsUtc(createdAt)}`,
    `LAST-MODIFIED:${formatIcsUtc(createdAt)}`,
    `DTSTART:${formatIcsUtc(input.start)}`,
    `DTEND:${formatIcsUtc(end)}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "TRANSP:OPAQUE",
    "X-MICROSOFT-CDO-BUSYSTATUS:BUSY",
    `SUMMARY:${escapeIcsText(`Discovery call: Yenson Umana x ${input.attendeeName}`)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(input.meetingUrl)}`,
    `URL:${escapeIcsText(input.meetingUrl)}`,
    `CONFERENCE;VALUE=URI:${escapeIcsText(input.meetingUrl)}`,
    `ORGANIZER;CN=Yenson Umana:mailto:${escapeIcsText(input.organizerEmail)}`,
    `ATTENDEE;CN=${escapeIcsParameter(input.attendeeName)};ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=FALSE:mailto:${escapeIcsText(input.attendeeEmail)}`,
    `ATTENDEE;CN=Yenson Umana;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=FALSE:mailto:${escapeIcsText(input.ownerEmail)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}

export function createGoogleCalendarUrl(input: {
  start: Date;
  meetingUrl: string;
  attendeeName: string;
  company: string;
}) {
  const end = getDiscoverySlotEnd(input.start);
  const query = new URLSearchParams({
    action: "TEMPLATE",
    text: `Discovery call: Yenson Umana x ${input.attendeeName}`,
    dates: `${formatIcsUtc(input.start)}/${formatIcsUtc(end)}`,
    details: `Discovery conversation with ${input.attendeeName} from ${input.company}.`,
    location: input.meetingUrl,
  });
  return `https://calendar.google.com/calendar/render?${query.toString()}`;
}

function formatIcsUtc(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function escapeIcsParameter(value: string) {
  return value.replace(/["\r\n]/g, "").replace(/[,;:]/g, " ");
}

function foldIcsLine(line: string) {
  const segments: string[] = [];
  let current = "";

  for (const character of line) {
    const candidate = current + character;
    if (Buffer.byteLength(candidate, "utf8") > 73 && current) {
      segments.push(current);
      current = ` ${character}`;
    } else {
      current = candidate;
    }
  }

  if (current) segments.push(current);
  return segments.join("\r\n");
}