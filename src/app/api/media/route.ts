import { NextRequest, NextResponse } from "next/server";
import { desc, eq, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/drizzle/db";
import { projectFiles } from "@/drizzle/schema";

// --- Schema Validation ---
const createMediaSchema = z.object({
  projectId: z.string().min(1),
  organizationId: z.string().min(1),
  url: z.string().url(),
  filename: z.string().min(1),
  size: z.number().optional(),
  mime_type: z.string().optional(),
  storage_provider: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const organizationId = searchParams.get("organizationId");

  if (!projectId || !organizationId) {
    return NextResponse.json(
      { error: "Missing projectId or organizationId" },
      { status: 400 }
    );
  }

  try {
    const items = await db
      .select()
      .from(projectFiles)
      .where(
        and(
          eq(projectFiles.projectId, projectId),
          eq(projectFiles.organizationId, organizationId)
        )
      )
      .orderBy(desc(projectFiles.createdAt))
      .limit(100); // Add pagination logic via offset if needed

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET Media Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createMediaSchema.parse(body);

    // 1. Generate the ID manually before insert
    const newFileId = crypto.randomUUID();

    // 2. Sanitize filename
    const sanitizedName = parsed.filename.replace(/[^a-zA-Z0-9.-]/g, "_");

    // 3. Insert into DB
    await db.insert(projectFiles).values({
      id: newFileId, // Use the generated ID
      projectId: parsed.projectId,
      organizationId: parsed.organizationId,
      name: sanitizedName,
      link: parsed.url,
      type: parsed.mime_type,
    });

    // 4. Return the ID we generated and the URL
    return NextResponse.json(
      {
        success: true,
        url: parsed.url,
        id: newFileId, // Explicitly return the variable we created
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Use .flatten() to get a clean object of field errors
      // or .issues for the raw array of validation issues
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error("POST Media Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
