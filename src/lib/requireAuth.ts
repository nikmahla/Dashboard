import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev_secret");

export async function requireAuth(req: Request) {
  const cookieHeader = req.headers.get("cookie");

  if (!cookieHeader) {
    return {
      ok: false,
      res: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const match = cookieHeader.match(/token=([^;]+)/);
  if (!match) {
    return {
      ok: false,
      res: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const token = match[1];

  try {
    const { payload } = await jwtVerify(token, secret);
    return { ok: true, user: payload };
  } catch {
    return {
      ok: false,
      res: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
}