import type { Metadata, Viewport } from "next";
import {
  Chakra_Petch,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";
import { Providers } from "@/components/providers";
import { DemoBanner } from "@/components/demo-banner";
import { Noise } from "@/components/effects/noise";
import "./globals.css";
const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-chakra",
});
const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: { default: "RT Motos | Demonstração", template: "%s | RT Motos" },
  description:
    "Demonstração do catálogo digital e painel da RT Motos, Fortaleza - CE. Dados fictícios.",
};
export const viewport: Viewport = {
  themeColor: "#0B0B0E",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <Providers>
          <a href="#conteudo" className="skip-link">
            Pular para o conteúdo
          </a>
          <Noise />
          <DemoBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
