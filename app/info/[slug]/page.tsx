import Header from "@/components/Header";

const titles: Record<string, string> = {
  marche: "Marché", agents: "Agents", aide: "Aide", fraude: "Fraude",
  scan: "Scan QR", "pin-oublie": "PIN oublié",
};

export default function Info({ params }: { params: { slug: string } }) {
  return (
    <main className="screen">
      <Header back="/" subtitle="MoMo" />
      <div className="grow" />
      <section className="sheet">
        <h1>{titles[params.slug] ?? "Bientôt disponible"}</h1>
        <p>Cette fonctionnalité n&apos;est pas encore disponible dans ce prototype.</p>
      </section>
    </main>
  );
}
