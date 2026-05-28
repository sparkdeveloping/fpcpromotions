import { NextResponse } from "next/server";
import { getDriveClient } from "@/lib/googleDrive";
import { requirePrivateAuth } from "@/lib/auth";

function safeQuery(value) {
  return String(value || "").replaceAll("'", "\\'");
}

export async function GET(req) {
  try {
    const isAllowed = await requirePrivateAuth();
    if (!isAllowed) return NextResponse.json({ error: "Unauthorized. Login again." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId") || "root";
    const search = searchParams.get("q");

    const drive = getDriveClient();
    const q = search
      ? `name contains '${safeQuery(search)}' and trashed = false`
      : `'${safeQuery(folderId)}' in parents and trashed = false`;

    const result = await drive.files.list({
      q,
      fields: "files(id, name, mimeType, size, modifiedTime, webViewLink, iconLink, thumbnailLink)",
      orderBy: "folder,name",
      pageSize: 100,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    return NextResponse.json({ files: result.data.files || [] });
  } catch (error) {
    console.error("Drive list route failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list Google Drive files.", details: error?.response?.data || null },
      { status: 500 }
    );
  }
}
