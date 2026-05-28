import { NextResponse } from "next/server";
import { Readable } from "stream";
import { getDriveClient } from "@/lib/googleDrive";
import { requirePrivateAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    const isAllowed = await requirePrivateAuth();
    if (!isAllowed) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");
    const folderId = formData.get("folderId");

    if (!file) return NextResponse.json({ error: "File is required." }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const drive = getDriveClient();

    const result = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: folderId && folderId !== "root" ? [folderId] : undefined,
      },
      media: {
        mimeType: file.type || "application/octet-stream",
        body: Readable.from(buffer),
      },
      fields: "id, name, mimeType, size, webViewLink, thumbnailLink",
      supportsAllDrives: true,
    });

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Drive upload route failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file.", details: error?.response?.data || null },
      { status: 500 }
    );
  }
}
