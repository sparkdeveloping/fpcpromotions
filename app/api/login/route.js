import { NextResponse } from "next/server";
import { people } from "@/lib/appData";

export async function POST(req) {
  const { password, userId } = await req.json();

  if (!process.env.APP_PASSWORD) {
    return NextResponse.json({ error: "APP_PASSWORD is missing in .env.local." }, { status: 500 });
  }

  const user = people.find((item) => item.id === userId);
  if (!user) return NextResponse.json({ error: "Choose a team member." }, { status: 400 });
  if (password !== process.env.APP_PASSWORD) return NextResponse.json({ error: "Invalid password." }, { status: 401 });

  const res = NextResponse.json({ success: true, user });
  res.cookies.set("private_app_token", password, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  res.cookies.set("current_media_user", encodeURIComponent(JSON.stringify(user)), { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
