import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { getCookie } from "@/lib/auth-cookie";

export async function GET(req: Request) {
  const token = getCookie(req, "token");
  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  try {
    const payload = await verifyToken(token);
    return NextResponse.json({ user: payload });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
