import type { MotoPublica } from "./data/schemas";
export function filtrarMotos(motos: MotoPublica[], p: URLSearchParams) {
  const termo = (p.get("busca") ?? "").toLocaleLowerCase("pt-BR");
  const filtered = motos.filter(
    (m) =>
      `${m.marca} ${m.modelo} ${m.versao ?? ""} ${m.anoFabricacao} ${m.anoModelo}`
        .toLocaleLowerCase("pt-BR")
        .includes(termo) &&
      (!p.get("marca") || m.marca === p.get("marca")) &&
      (!p.get("min") ||
        (m.preco !== null && m.preco >= Number(p.get("min")))) &&
      (!p.get("max") ||
        (m.preco !== null && m.preco <= Number(p.get("max")))) &&
      (!p.get("anoMin") || m.anoModelo >= Number(p.get("anoMin"))) &&
      (!p.get("anoMax") || m.anoModelo <= Number(p.get("anoMax"))) &&
      (!p.get("condicao") || m.condicao === p.get("condicao")) &&
      (!p.get("modalidade") || m.modalidade === p.get("modalidade")),
  );
  return filtered.sort((a, b) => {
    switch (p.get("ordem")) {
      case "preco":
        return (a.preco ?? Infinity) - (b.preco ?? Infinity);
      case "preco-desc":
        return (b.preco ?? -Infinity) - (a.preco ?? -Infinity);
      case "km":
        return a.km - b.km;
      case "ano":
        return b.anoModelo - a.anoModelo;
      default:
        return Date.parse(b.dataEntrada) - Date.parse(a.dataEntrada);
    }
  });
}
export function retornoSeguro(valor: string | null) {
  return valor?.startsWith("/?") || valor === "/" || valor === "/#estoque"
    ? valor
    : "/#estoque";
}
