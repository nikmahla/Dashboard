/**
 * Read one cookie by exact name.
 * (A regex like /token=/ would also match "mytoken=..." — this does not.)
 */
export function getCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [rawKey, ...rest] = part.trim().split("=");
    if (rawKey === name) return rest.join("=") || undefined;
  }
  return undefined;
}
