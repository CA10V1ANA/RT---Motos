import type { Moto, MotoPublica } from "./schemas";
export const visivelNaVitrine = (m: Moto) =>
  m.publicacao === "publicado" &&
  !m.arquivada &&
  m.disponibilidade !== "vendida";
export function motoPublica(m: Moto): MotoPublica {
  const { custos, venda, ...publica } = m;
  void custos;
  void venda;
  return publica;
}
export function selecionarMotosPublicas(motos: Moto[]) {
  return motos.filter(visivelNaVitrine).map(motoPublica);
}
export function selecionarMotoPublica(motos: Moto[], slug: string) {
  const m = motos.find((m) => m.slug === slug && m.publicacao === "publicado");
  return m ? motoPublica(m) : undefined;
}
