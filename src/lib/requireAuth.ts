import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getSecret } from "./secret";
import { getCookie } from "./auth-cookie";
import type { Role } from "./validation";

/** Who may do what. Viewers are read-only; only Admins manage users. */
export const READ: Role[] = ["Admin", "Editor", "Viewer"];
export const WRITE: Role[] = ["Admin", "Editor"];
export const ADMIN_ONLY: Role[] = ["Admin"];

type Options = { roles?: Role[] };

/**
 * Authentication (who are you?) and authorization (are you allowed?).
 *  - no/invalid token  -> 401
 *  - valid token, role not allowed -> 403
 */
export async function requireAuth(req: Request, options: Options = {}) {
  const token = getCookie(req, "token");
  if (!token) {
    return { ok: false as const, res: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = String(payload.role ?? "");

    if (options.roles && !options.roles.includes(role as Role)) {
      return {
        ok: false as const,
        res: NextResponse.json({ message: "You do not have permission to do this" }, { status: 403 }),
      };
    }
    return { ok: true as const, user: payload };
  } catch {
    return { ok: false as const, res: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }
}
