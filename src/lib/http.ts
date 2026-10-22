export class HttpError extends Error {
  status: number;
  bodyText: string;
  constructor(status: number, bodyText: string) {
    super(`HTTP ${status}`);
    this.status = status;
    this.bodyText = bodyText;
  }
}

export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    credentials: "include", 
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

if (!res.ok) {
  const text = await res.text().catch(() => "");
  throw new HttpError(res.status, text);
}

  return res.json() as Promise<T>;
}