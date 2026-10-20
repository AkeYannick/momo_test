import Link from "next/link";
import Logo from "./Logo";
import { Back, Bell } from "./Icons";

export default function Header({ back, subtitle = "Bienvenue sur MoMo", bell = false }: { back?: string; subtitle?: string; bell?: boolean }) {
  return (
    <header className="head">
      {back && (
        <Link href={back} className="back" aria-label="Retour"><Back /></Link>
      )}
      <Logo />
      <div className="who">
        <strong>Y&apos;ello!</strong>
        <span>{subtitle}</span>
      </div>
      {bell && <button className="bell" type="button" aria-label="Notifications"><Bell /></button>}
    </header>
  );
}
