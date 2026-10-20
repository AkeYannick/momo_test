import { cookies } from "next/headers";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SaveLastLogin from "@/components/SaveLastLogin";
import { readSession, SESSION_COOKIE } from "@/lib/session";

export default async function Dashboard() {
  const session = await readSession(cookies().get(SESSION_COOKIE)?.value);
  return (
    <main className="screen">
      <SaveLastLogin />
      <Header bell subtitle={`+225 ${session?.phone ?? ""}`} />
      <div className="grow" />
      <section className="sheet">
        <h1>Vous êtes connecté</h1>
        <p>Bienvenue sur MoMo, +225 {session?.phone}.</p>
        <form action="/api/auth/logout" method="post">
          <button className="btn ghost">Se déconnecter</button>
        </form>
        <div style={{ height: 22 }} />
        <hr />
        <BottomNav />
      </section>
    </main>
  );
}
