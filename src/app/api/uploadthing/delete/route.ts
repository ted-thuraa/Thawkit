import { currentUser } from "@/lib/authServer";
import { UTApi } from "uploadthing/server";
import { NextResponse } from "next/server";

// Initialize UTApi with your API key (securely from environment variables)
export const utapi = new UTApi();

export async function POST(req: Request) {
  const user = await currentUser(); // Or your preferred auth check

  // 1. Check for authentication
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileKey } = await req.json();

  // 2. Validate input
  if (!fileKey || typeof fileKey !== "string") {
    return NextResponse.json(
      { error: "File key is required" },
      { status: 400 }
    );
  }

  try {
    // 3. Attempt to delete the file from UploadThing
    const result = await utapi.deleteFiles(fileKey);

    console.log("UploadThing delete result:", result);

    // Check if the deletion was successful (UploadThing API might return { success: true })
    // Adjust this check based on the actual response structure if needed
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      // If UploadThing indicates failure (e.g., file not found, though it might still return success)
      return NextResponse.json(
        { error: "Failed to delete file from storage." },
        { status: 500 } // Or appropriate status
      );
    }
  } catch (error) {
    console.error("Error deleting file from UploadThing:", error);
    // Handle potential errors during the API call
    return NextResponse.json(
      { error: "Internal server error during file deletion." },
      { status: 500 }
    );
  }
}
