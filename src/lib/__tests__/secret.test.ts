/** @jest-environment node */
import { getSecret } from "../secret";

const env = process.env as Record<string, string | undefined>;

describe("getSecret", () => {
  const original = { ...env };

  afterEach(() => {
    env.NODE_ENV = original.NODE_ENV;
    env.JWT_SECRET = original.JWT_SECRET;
  });

  it("uses JWT_SECRET when it is set", () => {
    env.JWT_SECRET = "abc";
    expect(getSecret()).toEqual(new TextEncoder().encode("abc"));
  });

  it("falls back to a local-only secret outside production", () => {
    delete env.JWT_SECRET;
    env.NODE_ENV = "development";
    expect(getSecret().length).toBeGreaterThan(0);
  });

  it("throws in production when JWT_SECRET is missing", () => {
    delete env.JWT_SECRET;
    env.NODE_ENV = "production";
    expect(() => getSecret()).toThrow("JWT_SECRET");
  });
});
