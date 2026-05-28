import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  for (const name of ["private_app_token", "current_media_user"]) {
    res.cookies.set(name, "", { httpOnly: name === "private_app_token", secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  }
  return res;
}
