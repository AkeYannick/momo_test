import Link from "next/link";
import Header from "@/components/Header";
import QrDecor from "@/components/QrDecor";
import BottomNav from "@/components/BottomNav";
import LastLogin from "@/components/LastLogin";
import { Camera } from "@/components/Icons";

export default function Home() {
  return (
    <main className="screen">
      <Header bell />

      <section className="qr-wrap">
        <div className="qr-panel">
          <div className="qr-card">
            <QrDecor />
            <Link href="/info/scan" className="scan"><Camera /> Scan QR</Link>
          </div>
        </div>
        <p className="version">Version: 3.5.8</p>
      </section>

      <section className="sheet">
        <LastLogin />
        <Link href="/login" className="btn">Se connecter</Link>
        <div className="links">
          <Link href="/login">Changer de Compte</Link>
          <Link href="/info/pin-oublie">PIN oublié</Link>
        </div>
        <hr />
        <BottomNav />
      </section>
    </main>
  );
}
