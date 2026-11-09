import { NextResponse } from "next/server";
import { signToken, verifyToken } from "@/lib/jwt";

import { getCookie } from "@/lib/auth-cookie";
import { parseBody } from "@/lib/api-utils";
import { profileUpdate } from "@/lib/validation";

export async function PATCH(req: Request) {
  const token = getCookie(req, "token");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    const body = await parseBody(req, profileUpdate);
    if (!body.ok) return body.res;

    const name = body.data.name ?? String(payload.name ?? "");
    const email = body.data.email ?? String(payload.email ?? "");

    const sub = Number(payload.sub);
    const role = String(payload.role ?? "User");

    const user = { sub, name, email, role };

    const newToken = await signToken(user);

    const res = NextResponse.json({
      user: { id: sub, name, email, role },
    });

    res.cookies.set("token", newToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json({ message: "Invalid session" }, { status: 401 });
  }
}
