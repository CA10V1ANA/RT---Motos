"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Bike,
  Plus,
  MousePointer2,
  Settings,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import { useSessaoDemo, sairDemo } from "@/lib/data/session";
import { useDadosProntos } from "@/lib/data/hooks";
import { Brand } from "../brand";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/primitives";
const links = [
  ["/admin", "Visão geral & lucros", LayoutDashboard],
  ["/admin/motos", "Estoque de motos", Bike],
  ["/admin/motos/nova", "Nova moto", Plus],
  ["/admin/interessados", "Interessados", MousePointer2],
  ["/admin/configuracoes", "Configurações", Settings],
] as const;
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const sessao = useSessaoDemo();
  const pronto = useDadosProntos();
  const entrada = pathname === "/admin/entrar";
  useEffect(() => {
    if (pronto && !sessao && !entrada) router.replace("/admin/entrar");
  }, [pronto, sessao, entrada, router]);
  if (entrada) return <>{children}</>;
  if (!sessao || !pronto)
    return (
      <main id="conteudo" className="container-shell py-10">
        <Skeleton className="h-96" />
      </main>
    );
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Brand />
        <p className="eyebrow mt-4 mb-8">Painel da loja / demo</p>
        <nav aria-label="Gestão" className="grid gap-2">
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                (
                  href === "/admin"
                    ? pathname === href
                    : href === "/admin/motos"
                      ? pathname === href
                      : pathname.startsWith(href)
                )
                  ? "page"
                  : undefined
              }
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-10 grid gap-3">
          <Link href="/" target="_blank" className="nav-link gap-2 text-xs">
            Ver catálogo ao vivo <ArrowUpRight size={16} />
          </Link>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              sairDemo();
              router.replace("/admin/entrar");
            }}
          >
            <LogOut size={16} />
            Sair da demo
          </Button>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-top">
          <span className="eyebrow">RT Motos / modo demonstração</span>
          <Link className="nav-link text-xs" target="_blank" href="/">
            Catálogo ao vivo ↗
          </Link>
        </header>
        <main id="conteudo" className="admin-main">
          {children}
        </main>
      </div>
      <nav className="admin-mobile-nav" aria-label="Gestão no celular">
        {links.map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={pathname === href ? "page" : undefined}
          >
            <Icon size={20} />
            <span>
              {label === "Visão geral & lucros"
                ? "Visão geral"
                : label === "Estoque de motos"
                  ? "Estoque"
                  : label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
