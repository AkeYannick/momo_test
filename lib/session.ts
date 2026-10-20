import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "momo_session";
const key = () => new TextEncoder().encode(process.env.SESSION_SECRET ?? "dev-secret-change-me-dev-secret-change-me");

export async function signSession(phone: string) {
  return new SignJWT({ phone })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
}

export async function readSession(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return payload as { phone: string };
  } catch {
    return null;
  }
}

export const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
