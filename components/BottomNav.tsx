import Link from "next/link";
import { Basket, Pin, Help, Megaphone } from "./Icons";

const items = [
  { href: "/info/marche", label: "Marché", icon: <Basket /> },
  { href: "/info/agents", label: "Agents", icon: <Pin /> },
  { href: "/info/aide", label: "Aide", icon: <Help /> },
  { href: "/info/fraude", label: "Fraude", icon: <Megaphone /> },
];

export default function BottomNav() {
  return (
    <nav className="nav" aria-label="Services">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="nav-item">
          <span className="nav-ico">{i.icon}</span>
          <span>{i.label}</span>
        </Link>
      ))}
    </nav>
  );
}
