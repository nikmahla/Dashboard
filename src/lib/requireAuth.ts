import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getSecret } from "./secret";

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
    const { payload } = await jwtVerify(token, getSecret());
    return { ok: true, user: payload };
  } catch {
    return {
      ok: false,
      res: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
}