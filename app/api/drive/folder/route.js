import { NextResponse } from "next/server";
import { FOLDER_MIME_TYPE, getDriveClient } from "@/lib/googleDrive";
import { requirePrivateAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    const isAllowed = await requirePrivateAuth();
    if (!isAllowed) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { name, parentId, folders } = await req.json();
    if (!name) return NextResponse.json({ error: "Folder name is required." }, { status: 400 });

    const drive = getDriveClient();

    const root = await drive.files.create({
      requestBody: {
        name,
        mimeType: FOLDER_MIME_TYPE,
        parents: parentId && parentId !== "root" ? [parentId] : undefined,
      },
      fields: "id, name, mimeType, webViewLink",
      supportsAllDrives: true,
    });

    const children = [];
    if (Array.isArray(folders)) {
      for (const folderName of folders) {
        const child = await drive.files.create({
          requestBody: {
            name: folderName,
            mimeType: FOLDER_MIME_TYPE,
            parents: [root.data.id],
          },
          fields: "id, name, mimeType",
          supportsAllDrives: true,
        });
        children.push(child.data);
      }
    }

    return NextResponse.json({ folder: root.data, children });
  } catch (error) {
    console.error("Drive folder route failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create folder.", details: error?.response?.data || null },
      { status: 500 }
    );
  }
}
