import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  const users = [
    { id: 1, name: "Admin", email: "admin@test.com", password: "1234", role: "Admin" },
    { id: 2, name: "Viewer", email: "viewer@test.com", password: "1234", role: "Viewer" },
  ];

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  const token = await signToken({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}