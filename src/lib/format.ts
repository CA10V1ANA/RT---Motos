export const formatarMoeda = (valor: number | null) =>
  valor === null
    ? "Consulte o valor"
    : new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(valor);
export const formatarKm = (valor: number) =>
  `${new Intl.NumberFormat("pt-BR").format(valor)} km`;
export const formatarPercentual = (valor: number) =>
  `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(valor)}%`;
export const formatarData = (valor: string) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Fortaleza" }).format(
    new Date(valor),
  );
