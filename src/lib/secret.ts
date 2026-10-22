/**
 * JWT signing secret.
 * Read lazily (at request time, not at import time) so `next build` still works
 * without env vars. In production a missing secret is an error, never a default.
 */
export function getSecret(): Uint8Array {
  const value = process.env.JWT_SECRET;

  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET is not set. Add it to your environment variables.");
    }
    return new TextEncoder().encode("dev_secret_local_only");
  }

  return new TextEncoder().encode(value);
}
