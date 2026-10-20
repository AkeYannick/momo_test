// Abstraction d'envoi SMS : on change de fournisseur sans toucher au reste.
export async function sendSms(phone: string, text: string) {
  const provider = process.env.SMS_PROVIDER ?? "console";

  if (provider === "console") {
    console.log(`\n📩 SMS vers ${phone}\n${text}\n`);
    return;
  }

  if (provider === "orange") {
    // API SMS Orange (developer.orange.com) — vérifie les URLs/pays dans ta console Orange.
    const basic = Buffer.from(`${process.env.ORANGE_CLIENT_ID}:${process.env.ORANGE_CLIENT_SECRET}`).toString("base64");
    const tokenRes = await fetch("https://api.orange.com/oauth/v3/token", {
      method: "POST",
      headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
    });
    if (!tokenRes.ok) throw new Error("Orange OAuth failed");
    const { access_token } = await tokenRes.json();

    const sender = process.env.ORANGE_SENDER!;
    const res = await fetch(
      `https://api.orange.com/smsmessaging/v1/outbound/${encodeURIComponent("tel:" + sender)}/requests`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          outboundSMSMessageRequest: {
            address: `tel:+225${phone}`,
            senderAddress: `tel:${sender}`,
            outboundSMSTextMessage: { message: text },
          },
        }),
      }
    );
    if (!res.ok) throw new Error(`Orange SMS failed: ${res.status}`);
    return;
  }

  throw new Error(`SMS_PROVIDER inconnu: ${provider}`);
}
