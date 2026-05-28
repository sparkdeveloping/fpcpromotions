import { NextResponse } from "next/server";
import { getDriveClient } from "@/lib/googleDrive";
import { requirePrivateAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    const isAllowed = await requirePrivateAuth();
    if (!isAllowed) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { fileId } = await req.json();
    if (!fileId) return NextResponse.json({ error: "fileId is required." }, { status: 400 });

    const drive = getDriveClient();

    await drive.files.update({
      fileId,
      requestBody: { trashed: true },
      supportsAllDrives: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Drive delete route failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to trash file.", details: error?.response?.data || null },
      { status: 500 }
    );
  }
}
