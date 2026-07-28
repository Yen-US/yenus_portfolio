import { NextResponse } from "next/server";
import {
  DISCOVERY_DATE_COUNT,
  createDiscoverySlotStart,
  getAvailableDiscoveryDates,
} from "@/lib/discovery-schedule";
import {
  getBookedDiscoveryStarts,
  isDiscoveryBookingStoreConfigured,
} from "@/lib/discovery-bookings";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDiscoveryBookingStoreConfigured()) {
    return NextResponse.json(
      { error: "Live booking availability is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const dates = getAvailableDiscoveryDates(new Date(), DISCOVERY_DATE_COUNT);
    const firstStart = dates[0]
      ? createDiscoverySlotStart(dates[0], 10)
      : null;
    const lastStart = dates.at(-1)
      ? createDiscoverySlotStart(dates.at(-1)!, 17)
      : null;

    if (!firstStart || !lastStart) {
      return NextResponse.json(
        { bookedStarts: [] },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const bookedStarts = await getBookedDiscoveryStarts(
      firstStart,
      lastStart
    );
    return NextResponse.json(
      { bookedStarts },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Discovery availability lookup failed", error);
    return NextResponse.json(
      { error: "Live availability could not be loaded." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}