import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev_secret");

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, secret);

      // ✅ optional: role based
      // if (payload.role !== "Admin") {
      //   const url = req.nextUrl.clone();
      //   url.pathname = "/unauthorized";
      //   return NextResponse.redirect(url);
      // }

      return NextResponse.next();
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};