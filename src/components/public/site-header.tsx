"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  MapPin,
  ShieldCheck,
  ArrowLeftRight,
  Banknote,
} from "lucide-react";
import { Brand } from "../brand";
import { Button } from "../ui/button";
import { ResponsivePanel } from "../ui/responsive-panel";
import { WhatsAppLink } from "./whatsapp-link";
import { useConfigLoja } from "@/lib/data/hooks";
const links = [
  ["Início", "/"],
  ["Estoque", "/#estoque"],
  ["Repasse", "/?modalidade=repasse#estoque"],
  ["Avaliar minha troca", "/#troca"],
  ["Sobre", "/sobre"],
];
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header public-header">
      <div className="container-shell flex items-center justify-between gap-4 py-3">
        <Brand />
        <nav
          aria-label="Navegação principal"
          className="hidden xl:flex gap-5 text-xs text-muted"
        >
          {links.map(([label, href]) => (
            <Link className="nav-link" key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <WhatsAppLink secondary />
        </div>
        <Button
          className="header-menu px-3"
          variant="ghost"
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={23} />
        </Button>
      </div>
      <ResponsivePanel
        open={open}
        onOpenChange={setOpen}
        title="Explore a RT Motos"
      >
        <nav className="grid gap-2">
          {links.map(([label, href]) => (
            <Link
              className="nav-link"
              onClick={() => setOpen(false)}
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
          <WhatsAppLink secondary />
        </nav>
      </ResponsivePanel>
    </header>
  );
}
export function TrustStrip() {
  const config = useConfigLoja();
  return (
    <div className="trust-strip">
      {[
        [ShieldCheck, "Seminovas revisadas"],
        [ArrowLeftRight, "Aceitamos sua moto na troca"],
        [Banknote, "Financiamento"],
        [MapPin, config.cidade],
      ].map(([Icon, text]) => {
        const I = Icon as typeof MapPin;
        return (
          <p key={String(text)}>
            <I size={17} />
            {String(text)}
          </p>
        );
      })}
    </div>
  );
}
export function AboutStore() {
  const config = useConfigLoja();
  return (
    <section id="sobre" className="about-store">
      <div>
        <p className="eyebrow">Nossa casa / {config.cidade}</p>
        <h2 className="section-title mt-3">
          Paixão por motos.
          <br />
          Compromisso com você.
        </h2>
        <p className="text-muted leading-relaxed mt-5">{config.apresentacao}</p>
      </div>
      <div className="surface rounded-2xl p-6 space-y-5">
        <p className="font-display text-xl">{config.nome}</p>
        <p className="text-sm text-muted">{config.endereco}</p>
        <p className="text-sm text-muted">{config.horario}</p>
        <p className="text-sm text-silver">{config.instagram}</p>
        <WhatsAppLink secondary />
        <p className="text-xs text-muted">
          Contatos e condições de exemplo, sujeitos à confirmação da loja.
        </p>
      </div>
    </section>
  );
}
export function SiteFooter() {
  return (
    <footer className="container-shell footer">
      <Brand />
      <p>Fortaleza - CE · Demonstração com dados fictícios</p>
      <Link className="nav-link" href="/admin/entrar">
        Acesso da loja ↗
      </Link>
    </footer>
  );
}
