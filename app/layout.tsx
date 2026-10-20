import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = { title: "MoMo", description: "Prototype de connexion MoMo" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#00506f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}
