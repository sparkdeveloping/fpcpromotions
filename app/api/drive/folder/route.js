import { NextResponse } from "next/server";
import { FOLDER_MIME_TYPE, getDriveClient } from "@/lib/googleDrive";
import { requirePrivateAuth } from "@/lib/auth";

function normalizePath(path) {
  if (Array.isArray(path)) return path.filter(Boolean).map(String);
  return String(path || "")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
}

export async function POST(req) {
  try {
    const allowed = await requirePrivateAuth();
    if (!allowed) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { name, parentId, folders, paths } = await req.json();
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
    const pathMap = {
      "": root.data.id,
      [name]: root.data.id,
    };

    async function createChild(folderName, parentFolderId, pathKey) {
      const child = await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: FOLDER_MIME_TYPE,
          parents: [parentFolderId],
        },
        fields: "id, name, mimeType, webViewLink",
        supportsAllDrives: true,
      });

      const item = { ...child.data, path: pathKey };
      children.push(item);
      pathMap[pathKey] = child.data.id;
      return child.data;
    }

    for (const childName of Array.isArray(folders) ? folders : []) {
      await createChild(childName, root.data.id, childName);
    }

    for (const rawPath of Array.isArray(paths) ? paths : []) {
      const segments = normalizePath(rawPath);
      let currentParentId = root.data.id;
      let currentPath = "";

      for (const segment of segments) {
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;

        if (pathMap[currentPath]) {
          currentParentId = pathMap[currentPath];
          continue;
        }

        const created = await createChild(segment, currentParentId, currentPath);
        currentParentId = created.id;
      }
    }

    return NextResponse.json({ folder: root.data, children, pathMap });
  } catch (error) {
    console.error("Drive folder failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create folder.", details: error?.response?.data || null },
      { status: 500 }
    );
  }
}
