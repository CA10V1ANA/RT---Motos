import {
  AboutStore,
  SiteHeader,
  SiteFooter,
} from "@/components/public/site-header";
export const metadata = { title: "Sobre a loja" };
export default function Sobre() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="container-shell relative">
        <AboutStore />
      </main>
      <SiteFooter />
    </>
  );
}
