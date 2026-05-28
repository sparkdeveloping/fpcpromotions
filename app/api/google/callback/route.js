import { google } from "googleapis";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code.", { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);

  return new Response(
    `
COPY ONLY THIS LINE INTO .env.local:

GOOGLE_REFRESH_TOKEN=${tokens.refresh_token || "NO_REFRESH_TOKEN_RETURNED"}

Then restart your dev server.

Do not copy the access token.
Do not copy JSON.
Do not include quotes.
`,
    { headers: { "Content-Type": "text/plain" } }
  );
}
