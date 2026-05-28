import { NextResponse } from "next/server";
import { requirePrivateAuth, getCurrentUserFromCookie } from "@/lib/auth";

export async function GET() {
  const authorized = await requirePrivateAuth();
  const user = await getCurrentUserFromCookie();
  if (!authorized || !user) return NextResponse.json({ authorized: false }, { status: 401 });
  return NextResponse.json({ authorized: true, user });
}
