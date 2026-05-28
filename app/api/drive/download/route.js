import { NextResponse } from "next/server";
import { getDriveClient } from "@/lib/googleDrive";
import { requirePrivateAuth } from "@/lib/auth";

const EXPORT_TYPES = {
  "application/vnd.google-apps.document": { mimeType: "application/pdf", extension: "pdf" },
  "application/vnd.google-apps.spreadsheet": {
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extension: "xlsx",
  },
  "application/vnd.google-apps.presentation": {
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    extension: "pptx",
  },
};

export async function GET(req) {
  try {
    const isAllowed = await requirePrivateAuth();
    if (!isAllowed) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");
    if (!fileId) return NextResponse.json({ error: "fileId is required." }, { status: 400 });

    const drive = getDriveClient();
    const metadata = await drive.files.get({ fileId, fields: "name, mimeType", supportsAllDrives: true });

    const exportType = EXPORT_TYPES[metadata.data.mimeType];
    if (exportType) {
      const exported = await drive.files.export(
        { fileId, mimeType: exportType.mimeType },
        { responseType: "arraybuffer" }
      );

      return new NextResponse(exported.data, {
        headers: {
          "Content-Type": exportType.mimeType,
          "Content-Disposition": `attachment; filename="${metadata.data.name}.${exportType.extension}"`,
        },
      });
    }

    const file = await drive.files.get({ fileId, alt: "media", supportsAllDrives: true }, { responseType: "arraybuffer" });

    return new NextResponse(file.data, {
      headers: {
        "Content-Type": metadata.data.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${metadata.data.name || "download"}"`,
      },
    });
  } catch (error) {
    console.error("Drive download route failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to download file.", details: error?.response?.data || null },
      { status: 500 }
    );
  }
}
