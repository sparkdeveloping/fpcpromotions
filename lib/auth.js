import { cookies } from "next/headers";

export async function requirePrivateAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("private_app_token")?.value;
  if (!process.env.APP_PASSWORD) return false;
  return token === process.env.APP_PASSWORD;
}

export async function getCurrentUserFromCookie() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("current_media_user")?.value;
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}
