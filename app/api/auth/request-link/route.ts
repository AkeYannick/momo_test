import { NextRequest, NextResponse } from "next/server";
import { createLoginRequest } from "@/lib/store";
import { sendSms } from "@/lib/sms";

export async function POST(req: NextRequest) {
  const { phone } = await req.json().catch(() => ({ phone: "" }));

  // Côte d'Ivoire : 10 chiffres (depuis 2021)
  if (!/^\d{10}$/.test(phone ?? "")) {
    return NextResponse.json({ error: "Numéro invalide (10 chiffres attendus)" }, { status: 400 });
  }

  const result = await createLoginRequest(phone);
  if ("error" in result) {
    return NextResponse.json({ error: "Patientez 30 secondes avant de redemander un SMS" }, { status: 429 });
  }

  const base =
    process.env.APP_BASE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  const link = `${base}/api/auth/verify?token=${result.token}`;

  try {
    await sendSms(phone, `MoMo : cliquez sur ce lien pour vous connecter (valable 5 min) : ${link}`);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Échec de l'envoi du SMS" }, { status: 502 });
  }

  const res = NextResponse.json({
    ok: true,
    // visible seulement en dev pour tester sans vrai SMS
    // lien affiché sur la page tant qu'on n'a pas de vrai SMS (test / démo)
    devLink:
      process.env.SMS_PROVIDER === "console" &&
      (process.env.NODE_ENV !== "production" || process.env.SHOW_TEST_LINK === "true")
        ? link
        : undefined,
  });
  res.cookies.set("login_req", result.req.id, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 300,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
