export const COSTA_RICA_TIME_ZONE = "America/Costa_Rica";
export const COSTA_RICA_UTC_OFFSET = "-06:00";
export const DISCOVERY_DURATION_MINUTES = 30;
export const DISCOVERY_MIN_LEAD_MINUTES = 60;
export const DISCOVERY_DATE_COUNT = 10;
export const DISCOVERY_BOOKING_WINDOW_DAYS = 45;
export const DISCOVERY_SLOT_HOURS = [
  10, 11, 12, 13, 14, 15, 16, 17,
] as const;

export type DiscoverySlotHour = (typeof DISCOVERY_SLOT_HOURS)[number];

const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/;

export function createDiscoverySlotStart(
  dateKey: string,
  hour: number
): Date | null {
  if (
    !dateKeyPattern.test(dateKey) ||
    !DISCOVERY_SLOT_HOURS.includes(hour as DiscoverySlotHour)
  ) {
    return null;
  }

  const start = new Date(
    `${dateKey}T${String(hour).padStart(2, "0")}:00:00${COSTA_RICA_UTC_OFFSET}`
  );
  if (Number.isNaN(start.getTime())) return null;

  const parts = getZonedDateParts(start, COSTA_RICA_TIME_ZONE);
  if (
    `${parts.year}-${parts.month}-${parts.day}` !== dateKey ||
    Number(parts.hour) !== hour
  ) {
    return null;
  }

  return start;
}

export function getDiscoverySlotEnd(start: Date) {
  return new Date(start.getTime() + DISCOVERY_DURATION_MINUTES * 60_000);
}

export function getAvailableDiscoveryDates(
  now = new Date(),
  count = DISCOVERY_DATE_COUNT
) {
  const dates: string[] = [];
  const currentDateKey = getDateKeyInTimeZone(now, COSTA_RICA_TIME_ZONE);

  for (let offset = 0; offset <= DISCOVERY_BOOKING_WINDOW_DAYS; offset += 1) {
    const dateKey = addDaysToDateKey(currentDateKey, offset);
    if (!isCostaRicaWeekday(dateKey)) continue;
    if (getAvailableDiscoveryHours(dateKey, now).length === 0) continue;

    dates.push(dateKey);
    if (dates.length >= count) break;
  }

  return dates;
}

export function getAvailableDiscoveryHours(dateKey: string, now = new Date()) {
  const earliest = now.getTime() + DISCOVERY_MIN_LEAD_MINUTES * 60_000;
  return DISCOVERY_SLOT_HOURS.filter((hour) => {
    const start = createDiscoverySlotStart(dateKey, hour);
    return start ? start.getTime() >= earliest : false;
  });
}

export function isDiscoverySlotBookable(start: Date, now = new Date()) {
  if (Number.isNaN(start.getTime())) return false;
  if (!isWeekdayInTimeZone(start, COSTA_RICA_TIME_ZONE)) return false;

  const hour = Number(
    getZonedDateParts(start, COSTA_RICA_TIME_ZONE).hour
  );
  if (!DISCOVERY_SLOT_HOURS.includes(hour as DiscoverySlotHour)) return false;

  const earliest = now.getTime() + DISCOVERY_MIN_LEAD_MINUTES * 60_000;
  const latest = now.getTime() + DISCOVERY_BOOKING_WINDOW_DAYS * 86_400_000;
  return start.getTime() >= earliest && start.getTime() <= latest;
}

export function getDateKeyInTimeZone(date: Date, timeZone: string) {
  const parts = getZonedDateParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function formatDiscoveryDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone,
  }).format(date);
}

export function formatDiscoveryTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(date);
}

export function formatDiscoveryDateTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone,
  }).format(date);
}

export function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function addDaysToDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12));
  return date.toISOString().slice(0, 10);
}

function isCostaRicaWeekday(dateKey: string) {
  const start = createDiscoverySlotStart(dateKey, 12);
  return start ? isWeekdayInTimeZone(start, COSTA_RICA_TIME_ZONE) : false;
}

function isWeekdayInTimeZone(date: Date, timeZone: string) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone,
  }).format(date);
  return weekday !== "Sat" && weekday !== "Sun";
}

function getZonedDateParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).formatToParts(date);

  return Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  ) as Record<string, string>;
}