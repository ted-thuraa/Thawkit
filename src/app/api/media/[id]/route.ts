import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { projectFiles } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
// We need a server-side storage utility for deletion.
// For UploadThing, we use UTAPI. For others, we might use S3 SDK.
import { UTApi } from "uploadthing/server";

// Initialize UTAPI (make sure env vars are set)
const utapi = new UTApi();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    // 1. Fetch file info to get the storage provider and key/url
    const [fileRecord] = await db
      .select()
      .from(projectFiles)
      .where(eq(projectFiles.id, id))
      .limit(1);

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // 2. Delete from Storage Provider
    // Since we don't have a 'provider' column in the schema snippet you gave initially,
    // we assume we check the URL or use a default.
    // Ideally, add a `storage_provider` column to your schema.

    // Heuristic for UploadThing:
    if (
      fileRecord.link.includes("uploadthing") ||
      fileRecord.link.includes("utfs.io")
    ) {
      // Extract key from URL or assume you stored the key.
      // UploadThing URL: https://utfs.io/f/KEY
      const key = fileRecord.link.split("/").pop();
      if (key) {
        await utapi.deleteFiles(key);
      }
    }
    // Logic for other providers (Uploadcare/S3) would go here.

    // 3. Delete from Database
    await db.delete(projectFiles).where(eq(projectFiles.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Media Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
