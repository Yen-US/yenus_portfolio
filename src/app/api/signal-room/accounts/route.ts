import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createAccount,
  deleteAccount,
  getActiveIcp,
  updateAccount,
} from "@/lib/signal-room/store";
import { isSameOrigin, takeRateLimit } from "@/lib/signal-room/request-guard";
import {
  ACCOUNT_STATUSES,
  MUTUAL_FIT_VALUES,
} from "@/lib/signal-room/types";

const accountFields = {
  name: z.string().trim().min(1).max(150),
  website: z.union([z.string().trim().url(), z.literal("")]),
  stage: z.enum(["Seed", "Series A", "Series B", "Unknown"]),
  location: z.string().trim().max(150),
  oneLiner: z.string().trim().max(500),
  status: z.enum(ACCOUNT_STATUSES),
  fitScore: z.number().int().min(0).max(100),
  priority: z.enum(["high", "medium", "low"]),
  founderNames: z.array(z.string().trim().min(1).max(100)).max(12),
  linkedinUrl: z.union([z.string().trim().url(), z.literal("")]),
  notes: z.string().trim().max(5000),
};

/** Fields editable after creation but not required to create an account. */
const extendedFields = {
  disqualifiedReason: z.string().trim().max(500),
  targetRole: z.string().trim().max(120),
  targetName: z.string().trim().max(120),
  approxUsers: z.string().trim().max(200),
  mutualFit: z.enum(MUTUAL_FIT_VALUES),
  askSentAt: z.string().datetime().nullable(),
};

const createSchema = z.object(accountFields);
const updateSchema = z
  .object({ id: z.string().uuid(), ...accountFields, ...extendedFields })
  .partial()
  .required({ id: true });
const deleteSchema = z.object({ id: z.string().uuid() });

export async function POST(request: NextRequest) {
  return handleMutation(request, async () => {
    const input = createSchema.parse(await request.json());
    // Stamp the ICP the account was sourced under so scores stay comparable.
    const icp = await getActiveIcp();
    const account = await createAccount({
      ...input,
      brief: null,
      icpProfileId: icp?.id ?? null,
      disqualifiedReason: "",
      targetRole: "",
      targetName: "",
      approxUsers: "",
      mutualFit: "unknown",
      askSentAt: null,
    });
    return NextResponse.json({ account }, { status: 201 });
  });
}

export async function PATCH(request: NextRequest) {
  return handleMutation(request, async () => {
    const { id, ...input } = updateSchema.parse(await request.json());
    return NextResponse.json({ account: await updateAccount(id, input) });
  });
}

export async function DELETE(request: NextRequest) {
  return handleMutation(request, async () => {
    const { id } = deleteSchema.parse(await request.json());
    await deleteAccount(id);
    return NextResponse.json({ ok: true });
  });
}

async function handleMutation(
  request: NextRequest,
  action: () => Promise<NextResponse>
) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
  if (!takeRateLimit(request, "signal-accounts", 120, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Account update limit reached." }, { status: 429 });
  }

  try {
    return await action();
  } catch (error) {
    console.error("Signal Room account mutation failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Account update failed." },
      { status: error instanceof z.ZodError ? 400 : 502 }
    );
  }
}