"use client";
import { useEffect } from "react";

export default function SaveLastLogin() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("momo_saved")) return;
      localStorage.setItem("momo_last_login", new Date().toISOString());
      sessionStorage.setItem("momo_saved", "1");
    } catch {}
  }, []);
  return null;
}
