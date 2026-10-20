import { NextRequest, NextResponse } from "next/server";
import { getRequest } from "@/lib/store";
import { signSession, SESSION_COOKIE, cookieOpts } from "@/lib/session";

// Polling de la page "SMS envoyé" : détecte quand le lien a été cliqué
// (même depuis un autre navigateur/appareil).
export async function GET(req: NextRequest) {
  const id = req.cookies.get("login_req")?.value;
  const r = id ? await getRequest(id) : undefined;

  if (!r) return NextResponse.json({ status: "unknown" });
  if (r.verified) {
    const res = NextResponse.json({ status: "verified" });
    res.cookies.set(SESSION_COOKIE, await signSession(r.phone), cookieOpts);
    res.cookies.delete("login_req");
    return res;
  }
  if (r.expiresAt < Date.now()) return NextResponse.json({ status: "expired" });
  return NextResponse.json({ status: "pending" });
}
