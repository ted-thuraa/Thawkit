import { db } from "@/drizzle/db";
import { analyticsEvents } from "@/drizzle/schemas/analytics";
import { getAnalyticsContext, hashIpAddress } from "@/lib/utils/analytics";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      projectId,
      funnelPageId,
      eventType,
      eventName,
      visitorId,
      sessionId,
      metadata,
    } = body;

    if (!projectId || !eventType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Get Context (Headers, IP, Bot Check)
    const ctx = await getAnalyticsContext();

    if (ctx.isBot) {
      return NextResponse.json({ success: true, ignored: true });
    }

    // 2. Insert into MySQL
    await db.insert(analyticsEvents).values({
      id: uuidv4(),
      projectId,
      funnelPageId: funnelPageId || null,
      eventType,
      eventName: eventName || null,
      visitorId: visitorId || "anonymous",
      sessionId: sessionId || "unknown",
      ipHash: hashIpAddress(ctx.ip),
      country: ctx.country,
      referrer: ctx.referrer,
      userAgent: ctx.userAgent,
      metadata: metadata || {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics Write Error:", error);
    console.log(error);
    // Return 200 to prevent client errors
    return NextResponse.json(
      { success: false, error: "Internal Error" },
      { status: 200 }
    );
  }
}
