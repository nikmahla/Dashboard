import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { parseBody } from "@/lib/api-utils";
import { loginSchema } from "@/lib/validation";
import { authUsers, DUMMY_HASH } from "@/lib/data/auth-users";

export async function POST(req: Request) {
  const body = await parseBody(req, loginSchema);
  if (!body.ok) return body.res;
  const { email, password } = body.data;

  const user = authUsers.find((u) => u.email === email);
  // Always run bcrypt so "unknown email" and "wrong password" take about the same time.
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({ sub: user.id, name: user.name, email: user.email, role: user.role });

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
