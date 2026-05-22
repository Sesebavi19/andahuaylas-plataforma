import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Andahuaylas Go — Plataforma Turística, Gastronómica y Comercial",
  description:
    "Explora los atractivos turísticos, restaurantes y comercios de Andahuaylas, Apurímac.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={dmSans.className}>
      <body className="min-h-screen flex flex-col antialiased bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}
