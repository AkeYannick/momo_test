"use client";
import { useEffect, useState } from "react";

export default function LastLogin() {
  const [txt, setTxt] = useState("Bienvenue sur MoMo");
  useEffect(() => {
    try {
      const v = localStorage.getItem("momo_last_login");
      if (!v) return;
      const d = new Date(v);
      const p = (n: number) => String(n).padStart(2, "0");
      setTxt(`Dernière connexion: ${p(d.getHours())}:${p(d.getMinutes())} | ${p(d.getDate())}/${p(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)}`);
    } catch {}
  }, []);
  return <p className="last">{txt}</p>;
}
