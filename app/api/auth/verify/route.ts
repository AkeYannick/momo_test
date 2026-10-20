import { NextRequest, NextResponse } from "next/server";
import { consumeToken } from "@/lib/store";
import { signSession, SESSION_COOKIE, cookieOpts } from "@/lib/session";

// L'utilisateur clique sur le lien reçu par SMS
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const loginReq = await consumeToken(token);

  if (!loginReq) {
    return NextResponse.redirect(new URL("/login?error=invalid", req.url));
  }

  const res = NextResponse.redirect(new URL("/dashboard", req.url));
  res.cookies.set(SESSION_COOKIE, await signSession(loginReq.phone), cookieOpts);
  return res;
}
