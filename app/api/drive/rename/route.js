import { NextResponse } from "next/server";
import { getDriveClient } from "@/lib/googleDrive";
import { requirePrivateAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    const isAllowed = await requirePrivateAuth();
    if (!isAllowed) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { fileId, name } = await req.json();
    if (!fileId || !name) {
      return NextResponse.json({ error: "fileId and name are required." }, { status: 400 });
    }

    const drive = getDriveClient();
    const result = await drive.files.update({
      fileId,
      requestBody: { name },
      fields: "id, name, mimeType, webViewLink",
      supportsAllDrives: true,
    });

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Drive rename route failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to rename file.", details: error?.response?.data || null },
      { status: 500 }
    );
  }
}
