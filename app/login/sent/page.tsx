"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default function Sent() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [devLink, setDevLink] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setPhone(sessionStorage.getItem("phone") ?? "");
    setDevLink(sessionStorage.getItem("devLink"));
    const t = setInterval(async () => {
      const r = await fetch("/api/auth/status", { cache: "no-store" });
      const { status } = await r.json();
      if (status === "verified") { clearInterval(t); router.replace("/dashboard"); }
      if (status === "expired" || status === "unknown") { clearInterval(t); setExpired(true); }
    }, 2000);
    return () => clearInterval(t);
  }, [router]);

  return (
    <main className="screen">
      <Header back="/login" subtitle="Connexion à MoMo" />
      <div className="grow" />
      <section className="sheet">
        <h1>Vérifiez vos SMS</h1>
        {expired ? (
          <>
            <p>Le lien a expiré. Demandez-en un nouveau.</p>
            <Link href="/login" className="btn">Renvoyer un SMS</Link>
          </>
        ) : (
          <>
            <p>Nous avons envoyé un lien de connexion au +225 {phone}. Ouvrez le SMS et touchez le lien pour vous connecter.</p>
            <p>En attente de confirmation…</p>
            {devLink && (
              <p>
                Lien reçu par SMS :{" "}
                <a className="confirm-link" href={devLink}>Confirmer ma connexion</a>
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
