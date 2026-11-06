export const acervoLoja = [
  {
    nome: "Honda CG 160 Fan preta (c/ protetor)",
    pasta: "RT-020",
    legendas: ["Lateral", "Frente", "Traseira"],
  },
  {
    nome: "Honda NXR 160 Bros ESDD preta",
    pasta: "RT-012",
    legendas: ["Lateral", "Frente", "Traseira", "Painel"],
  },
  {
    nome: "Honda CB 300F Twister ABS vermelha",
    pasta: "RT-018",
    legendas: ["Visão geral", "Frente", "Traseira", "Painel"],
  },
  {
    nome: "BMW G 310 GS Rallye",
    pasta: "RT-015",
    legendas: [
      "Visão geral",
      "Frente",
      "Lateral",
      "Traseira",
      "Tanque e quadro",
      "Painel",
    ],
  },
  {
    nome: "Honda CG 160 Fan preta (repasse)",
    pasta: "RT-021",
    legendas: ["Visão geral", "Frente", "Traseira", "Guidão e farol"],
  },
].map((grupo) => ({
  nome: grupo.nome,
  fotos: grupo.legendas.map((legenda, i) => ({
    src: `/motos/${grupo.pasta}/${i}.jpg`,
    legenda,
  })),
}));
