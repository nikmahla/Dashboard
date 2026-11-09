import type { Role } from "../validation";

// Demo accounts. Passwords are stored as bcrypt hashes (never plain text).
// Both demo passwords are "1234". In the PostgreSQL step this becomes a User table.
export const authUsers: { id: number; name: string; email: string; passwordHash: string; role: Role }[] = [
  { id: 1, name: "Admin", email: "admin@test.com", passwordHash: "$2b$10$YPt2lgZ5t1u71.PtYGBD1eqh6d8SLr7yHLBgA5ldxa6CqmF4uPXDC", role: "Admin" },
  { id: 2, name: "Viewer", email: "viewer@test.com", passwordHash: "$2b$10$YPt2lgZ5t1u71.PtYGBD1eqh6d8SLr7yHLBgA5ldxa6CqmF4uPXDC", role: "Viewer" },
];

// Used to keep response time similar when the email does not exist (avoids user enumeration by timing).
export const DUMMY_HASH = authUsers[0].passwordHash;
