import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Metadata base estática (no llama ensureSeed — eso es side effect)
export const metadata: Metadata = {
  title: "Diginast — Hardware de Alto Rendimiento & Setups Pro",
  description: "Setups gaming premium, workstations profesionales, componentes de última generación y refrigeración líquida con ingeniería de precisión.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

// ensureSeed se llama en cada page component server-side, no aquí
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="font-display antialiased">{children}</body>
    </html>
  );
}
