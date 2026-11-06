import { dadosSchema, type Moto, type DadosDemo, type Foto } from "./schemas";

export const REFERENCIA_DEMO = "2026-11-05T12:00:00.000Z";

export const slugMoto = (marca: string, modelo: string, ano: number, codigo: string) =>
  `${marca}-${modelo}-${ano}-${codigo}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

const fotosPasta = (codigo: string, pasta: string, legendas: string[], ext = "jpg"): Foto[] =>
  legendas.map((legenda, i) => ({
    id: `${codigo}-${i}`,
    src: `/motos/${pasta}/${i}.${ext}`,
    legenda,
  }));

const custos = (aquisicao = 0, oficina = 0, estetica = 0, documentacao = 0, outros = 0) => ({
  aquisicao,
  oficina,
  estetica,
  documentacao,
  outros,
});

function base(n: number, marca: string, modelo: string, ano: number): Moto {
  const codigo = `RT-${String(n).padStart(3, "0")}`;
  return {
    id: codigo,
    codigo,
    slug: slugMoto(marca, modelo, ano, codigo),
    marca,
    modelo,
    anoFabricacao: ano,
    anoModelo: ano,
    km: 10000,
    cilindrada: 160,
    cor: "Preta",
    combustivel: "Flex",
    partida: "Elétrica",
    freios: "Disco/tambor",
    condicao: "seminova",
    modalidade: "estoque_proprio",
    preco: null,
    aceitaTroca: true,
    financiamento: true,
    descricao:
      "Moto seminova do acervo da RT Motos. Informações comerciais e financeiras fictícias para demonstração do sistema.",
    acessorios: [],
    documentacao: "Licenciada — exemplo fictício",
    fotos: fotosPasta(codigo, codigo, ["Lateral", "Frente", "Painel"], "svg"),
    hotspots: [],
    destaque: false,
    publicacao: "publicado",
    disponibilidade: "disponivel",
    arquivada: false,
    custos: custos(),
    dataEntrada: "2026-10-01T12:00:00.000Z",
    atualizadoEm: REFERENCIA_DEMO,
  };
}

export function criarSeed(): DadosDemo {
  const bros: Moto = {
    ...base(12, "Honda", "NXR 160 Bros", 2024),
    versao: "ESDD",
    anoFabricacao: 2023,
    km: 4535,
    cor: "Preta",
    freios: "CBS (disco nas 2 rodas)",
    preco: 18900,
    destaque: true,
    fotos: fotosPasta("RT-012", "RT-012", ["Lateral", "Frente", "Traseira", "Painel"]),
    hotspots: [
      {
        id: "pneus",
        fotoId: "RT-012-2",
        x: 47,
        y: 74,
        titulo: "Pneus novos",
        descricao: "Freio a disco traseiro ESDD e pneus em ótimo estado — demonstração.",
      },
      {
        id: "motor",
        fotoId: "RT-012-0",
        x: 49,
        y: 57,
        titulo: "Motor revisado",
        descricao: "Motor 160cc Flex revisado na oficina — demonstração.",
      },
      {
        id: "painel",
        fotoId: "RT-012-3",
        x: 52,
        y: 32,
        titulo: "4.535 km",
        descricao: "Painel digital completo marcando 4.535 km.",
      },
    ],
    custos: custos(14500, 650, 250, 400),
  };

  const bmw: Moto = {
    ...base(15, "BMW", "G 310 GS", 2023),
    versao: "Rallye",
    anoFabricacao: 2022,
    km: 15253,
    cilindrada: 313,
    cor: "Verde Kalamata",
    combustivel: "Gasolina",
    freios: "ABS",
    preco: 27500,
    disponibilidade: "reservada",
    fotos: fotosPasta("RT-015", "RT-015", [
      "Visão geral",
      "Frente",
      "Lateral",
      "Traseira",
      "Tanque e quadro",
      "Painel",
    ]),
    hotspots: [
      {
        id: "suspensao",
        fotoId: "RT-015-1",
        x: 56,
        y: 62,
        titulo: "Suspensão invertida",
        descricao: "Garfo invertido dourado e freios ABS BMW Motorrad.",
      },
      {
        id: "painel-bmw",
        fotoId: "RT-015-5",
        x: 49,
        y: 35,
        titulo: "15.253 km",
        descricao: "Painel LCD multifuncional com 15.253 km registrados.",
      },
    ],
    custos: custos(22300, 600, 200, 300),
  };

  const cb300: Moto = {
    ...base(18, "Honda", "CB 300F Twister", 2024),
    versao: "ABS",
    anoFabricacao: 2023,
    km: 5635,
    cilindrada: 294,
    cor: "Vermelha",
    combustivel: "Flex",
    freios: "ABS",
    preco: 29900,
    destaque: true,
    fotos: fotosPasta("RT-018", "RT-018", ["Visão geral", "Frente", "Traseira", "Painel"]),
    hotspots: [
      {
        id: "abs-cb",
        fotoId: "RT-018-1",
        x: 55,
        y: 72,
        titulo: "Freios ABS",
        descricao: "Sistema ABS nas duas rodas e iluminação full LED.",
      },
      {
        id: "painel-cb",
        fotoId: "RT-018-3",
        x: 48,
        y: 28,
        titulo: "5.635 km",
        descricao: "Painel blackout digital marcando 5.635 km.",
      },
    ],
    custos: custos(24000, 500, 300, 400),
  };

  const fanEstoque: Moto = {
    ...base(20, "Honda", "CG 160 Fan", 2022),
    versao: "ESDi",
    anoFabricacao: 2022,
    km: 21300,
    cor: "Preta",
    freios: "CBS",
    preco: 13490,
    acessorios: ["Protetor de carenagem", "Manoplas esportivas"],
    fotos: fotosPasta("RT-020", "RT-020", ["Lateral", "Frente", "Traseira"]),
    custos: custos(10800, 450, 150, 350),
  };

  const fanRepasse: Moto = {
    ...base(21, "Honda", "CG 160 Fan", 2022),
    versao: "",
    anoFabricacao: 2021,
    km: 26000,
    cor: "Preta",
    freios: "CBS",
    modalidade: "repasse",
    condicoesTexto: "Repasse, sem garantia da loja.",
    dataEntrada: "2026-08-22T12:00:00.000Z",
    preco: 16900,
    fotos: fotosPasta("RT-021", "RT-021", ["Visão geral", "Frente", "Traseira", "Guidão e farol"]),
    custos: custos(15200, 0, 0, 300),
  };

  const popRascunho: Moto = {
    ...base(22, "Honda", "Pop 110i", 2024),
    versao: "",
    km: 3100,
    cilindrada: 110,
    cor: "Branca",
    combustivel: "Gasolina",
    publicacao: "rascunho",
    preco: 9990,
    custos: custos(8200, 150, 100, 250),
  };

  const motos: Moto[] = [bros, bmw, cb300, fanEstoque, fanRepasse, popRascunho];

  const historico = [
    [1, "Honda", "Biz 125", 2021, "06-14", 11200, 9400, undefined],
    [2, "Yamaha", "Crosser 150", 2022, "07-09", 15900, 13600, undefined],
    [3, "Honda", "CG 160 Titan", 2023, "07-28", 17400, 14900, "RT-021"],
    [4, "Honda", "PCX 160", 2023, "08-21", 18700, 16100, undefined],
    [5, "Yamaha", "Lander 250", 2022, "09-05", 21500, 18300, undefined],
    [7, "Yamaha", "Factor 150", 2022, "09-27", 12800, 11150, undefined],
    [9, "Honda", "CB 300F Twister", 2023, "10-18", 24500, 21850, "RT-018"],
    [6, "Honda", "NXR 160 Bros", 2022, "11-02", 16800, 14300, "RT-012"],
  ] as const;

  historico.forEach(([n, marca, modelo, ano, dia, valorFinal, custo, pastaReal]) => {
    const data = `2026-${dia}T12:00:00.000Z`;
    const item = base(n, marca, modelo, ano);
    motos.push({
      ...item,
      cor: n === 9 ? "Vermelha" : item.cor,
      fotos: pastaReal
        ? fotosPasta(item.codigo, pastaReal, ["Lateral", "Frente", "Traseira"])
        : item.fotos,
      preco: valorFinal,
      disponibilidade: "vendida",
      arquivada: true,
      custos: custos(custo),
      venda: { valorFinal, data, forma: "a_vista" },
      dataEntrada: new Date(Date.parse(data) - (25 + n) * 86400000).toISOString(),
      atualizadoEm: data,
    });
  });

  const cliques = [
    [12, 28],
    [15, 21],
    [18, 17],
    [20, 12],
    [21, 9],
  ].flatMap(([n, total]) =>
    Array.from({ length: total }, (_, i) => ({
      id: `clique-${n}-${i}`,
      motoId: `RT-${String(n).padStart(3, "0")}`,
      tipo: (["interesse", "troca", "financiamento"] as const)[i % 3],
      data: new Date(Date.parse(REFERENCIA_DEMO) - (i % 30) * 86400000).toISOString(),
    })),
  );

  return dadosSchema.parse({
    motos,
    cliques,
    proximoCodigo: 23,
    config: {
      nome: "RT Motos",
      whatsapp: "5585900000000",
      cidade: "Fortaleza - CE",
      endereco: "Endereço ilustrativo — Fortaleza, CE",
      horario: "Segunda a sexta, 8h às 18h; sábado, 8h às 12h — exemplo",
      instagram: "@rtmotosoficial",
      apresentacao:
        "Seminovas, estoque próprio e repasse. Sua próxima história começa sobre duas rodas.",
      urlBase: "http://localhost:3000",
    },
  });
}
