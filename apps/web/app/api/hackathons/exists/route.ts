import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../../src/db";
import { events } from "../../../../src/db/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const link = searchParams.get("link")?.trim();

  if (!link) {
    return NextResponse.json(
      { error: "link query param is required" },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select({ id: events.id })
    .from(events)
    .where(eq(events.link, link))
    .limit(1);

  return NextResponse.json({
    exists: Boolean(existing),
    id: existing?.id ?? null,
  });
}
