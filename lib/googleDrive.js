import { google } from "googleapis";

export const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

function clean(value) {
  return String(value || "").trim().replace(/^["']|["']$/g, "");
}

function assertEnv() {
  const required = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI",
    "GOOGLE_REFRESH_TOKEN",
  ];

  for (const key of required) {
    if (!clean(process.env[key])) {
      throw new Error(`Missing ${key} in .env.local`);
    }
  }

  const token = clean(process.env.GOOGLE_REFRESH_TOKEN);
  if (token.includes("access_token") || token.includes("{") || token.includes("}")) {
    throw new Error("GOOGLE_REFRESH_TOKEN is malformed. Copy only the refresh_token value.");
  }
}

export function getDriveClient() {
  assertEnv();

  const auth = new google.auth.OAuth2(
    clean(process.env.GOOGLE_CLIENT_ID),
    clean(process.env.GOOGLE_CLIENT_SECRET),
    clean(process.env.GOOGLE_REDIRECT_URI)
  );

  auth.setCredentials({
    refresh_token: clean(process.env.GOOGLE_REFRESH_TOKEN),
  });

  return google.drive({ version: "v3", auth });
}
