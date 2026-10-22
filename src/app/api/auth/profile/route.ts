import { NextResponse } from "next/server";
import { signToken, verifyToken } from "@/lib/jwt";

function getToken(req: Request) {
  return req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];
}

export async function PATCH(req: Request) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    const body = await req.json();

    const name = String(body.name ?? payload.name ?? "").trim();
    const email = String(body.email ?? payload.email ?? "")
      .trim()
      .toLowerCase();

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Valid email is required" }, { status: 400 });
    }

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
