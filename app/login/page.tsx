"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(params.get("error") === "invalid" ? "Lien invalide ou expiré. Redemandez un SMS." : "");
  const [loading, setLoading] = useState(false);
  const valid = /^\d{10}$/.test(phone);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      sessionStorage.setItem("phone", phone);
      if (data.devLink) sessionStorage.setItem("devLink", data.devLink);
      else sessionStorage.removeItem("devLink");
      router.push("/login/sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="screen" onSubmit={submit} noValidate>
      <Header back="/" subtitle="Connexion à MoMo" />
      <div className="grow" />
      <section className="sheet">
        <h1>Connexion</h1>
        <p>Saisissez votre numéro MTN. Vous recevrez un SMS avec un lien pour vous connecter.</p>
        <div className="row">
          <div className="prefix"><span className="flag" aria-hidden />+225</div>
          <div className="field">
            <input
              inputMode="numeric" autoComplete="tel-national" autoFocus maxLength={10}
              placeholder="Numéro de téléphone" aria-label="Numéro de téléphone"
              className={error ? "invalid" : ""} value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
            />
            {error && <div className="err" role="alert">{error}</div>}
          </div>
        </div>
        <button className="btn" disabled={!valid || loading}>{loading ? "Envoi…" : "Se connecter"}</button>
      </section>
    </form>
  );
}

export default function Login() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
