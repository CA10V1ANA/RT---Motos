import { test } from "node:test";
import assert from "node:assert/strict";
import { criarSeed, REFERENCIA_DEMO } from "../src/lib/data/seed";
import { motoSchema } from "../src/lib/data/schemas";
import {
  selecionarMotosPublicas,
  selecionarMotoPublica,
} from "../src/lib/data/selectors";
import {
  calcularKpis,
  custoTotal,
  lucroMoto,
  margemMoto,
  rankingProcura,
  serieMensal,
} from "../src/lib/finance";
import {
  linkWhatsApp,
  mensagemInteresse,
  mensagemTroca,
  mensagemFinanciamento,
} from "../src/lib/whatsapp";

test("seed, visibilidade e fronteira dos dados públicos", () => {
  const seed = criarSeed();
  assert.equal(seed.motos.length, 14);
  assert.equal(seed.cliques.length, 87);
  const publicas = selecionarMotosPublicas(seed.motos);
  assert.equal(publicas.length, 5);
  assert.ok(publicas.every((m) => !("custos" in m) && !("venda" in m)));
  assert.equal(
    publicas.filter((m) => m.disponibilidade === "reservada").length,
    1,
  );
  assert.equal(
    selecionarMotoPublica(
      seed.motos,
      seed.motos.find((m) => m.codigo === "RT-022")!.slug,
    ),
    undefined,
  );
  const vendida = seed.motos.find((m) => m.codigo === "RT-001")!;
  assert.equal(
    selecionarMotoPublica(seed.motos, vendida.slug)?.disponibilidade,
    "vendida",
  );
  const bros = seed.motos[0];
  assert.equal(bros.hotspots.length, 3);
  assert.ok(seed.motos.every((m) => m.fotos.length >= 3));
  assert.ok(!motoSchema.safeParse({ ...bros, km: -1 }).success);
  assert.ok(
    !motoSchema.safeParse({ ...bros, disponibilidade: "vendida" }).success,
  );
  assert.ok(
    !motoSchema.safeParse({
      ...bros,
      hotspots: [{ ...bros.hotspots[0], x: 101 }],
    }).success,
  );
});
test("custo e margem da Bros, incluindo alteração de preço e valor nulo", () => {
  const bros = criarSeed().motos[0];
  assert.equal(custoTotal(bros.custos), 15800);
  assert.equal(lucroMoto(bros), 3100);
  assert.ok(Math.abs(margemMoto(bros)! - 16.4021164) < 0.001);
  assert.equal(lucroMoto({ ...bros, preco: 19500 }), 3700);
  assert.equal(lucroMoto({ ...bros, preco: null }), null);
  assert.equal(margemMoto({ ...bros, preco: 0 }), null);
});
test("KPIs históricos, períodos, estoque, alertas e ranking são derivados", () => {
  const seed = criarSeed();
  const kpis = calcularKpis(seed.motos, "tudo");
  assert.equal(kpis.faturamento, 138800);
  assert.equal(kpis.custos, 119600);
  assert.equal(kpis.lucroRealizado, 19200);
  assert.equal(kpis.capitalEstoque, 100350);
  assert.equal(kpis.quantidadeEstoque, 6);
  assert.equal(calcularKpis(seed.motos, "mes").faturamento, 16800);
  assert.equal(calcularKpis(seed.motos, "3meses").faturamento, 75600);
  assert.equal(kpis.alertas.paradas[0].codigo, "RT-021");
  assert.equal(kpis.alertas.margemBaixa[0].codigo, "RT-021");
  const rank = rankingProcura(seed.motos, seed.cliques, "tudo");
  assert.deepEqual(
    rank.map((m) => m.cliques),
    [28, 21, 17, 12, 9],
  );
  const meses = serieMensal(seed.motos);
  assert.equal(
    meses.reduce((s, m) => s + m.receita, 0),
    kpis.faturamento,
  );
});
test("venda da Bros modifica os seletores e os totais sem KPI fixo", () => {
  const seed = criarSeed();
  const bros = seed.motos[0];
  bros.disponibilidade = "vendida";
  bros.venda = { data: REFERENCIA_DEMO, valorFinal: 19200 };
  assert.equal(selecionarMotosPublicas(seed.motos).length, 4);
  const kpis = calcularKpis(seed.motos, "mes");
  assert.equal(kpis.faturamento, 36000);
  assert.equal(kpis.lucroRealizado, 5900);
  assert.equal(calcularKpis([], "mes").giroMedioDias, 0);
});
test("mensagens preservam contexto, reserva e simulação sem calcular parcelas", () => {
  const seed = criarSeed();
  const moto = selecionarMotosPublicas(seed.motos)[0];
  const texto = mensagemInteresse(seed.config, moto);
  const link = new URL(linkWhatsApp(seed.config.whatsapp, texto));
  assert.equal(link.searchParams.get("text"), texto);
  assert.ok(texto.includes("RT-012"));
  assert.ok(texto.includes(moto.slug));
  assert.match(
    mensagemInteresse(seed.config, selecionarMotosPublicas(seed.motos)[1]),
    /reservada/,
  );
  assert.match(
    mensagemTroca(seed.config, moto, {
      modelo: "Fan",
      ano: 2020,
      faixaKm: "10–20 mil km",
      estado: "Bom",
      financiarDiferenca: true,
    }),
    /avaliação é feita pela equipe/,
  );
  assert.match(
    mensagemFinanciamento(seed.config, moto, { prazo: 36, entrada: 1000 }),
    /36x/,
  );
  assert.throws(() => linkWhatsApp("invalido", texto));
});
