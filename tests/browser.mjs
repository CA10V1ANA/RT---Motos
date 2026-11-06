import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";
import { build } from "esbuild";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const errors = [];
try {
  const p = await context.newPage();
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto("http://127.0.0.1:3000");
  await p.getByRole("heading", { name: /SEU PRÓXIMO/ }).waitFor();
  await p.screenshot({ path: "test-results/base-desktop.png", fullPage: true });
  const bundled = await build({
    entryPoints: ["tests/browser-fixture.ts"],
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
  });
  await p.addScriptTag({ content: bundled.outputFiles[0].text });
  await p.evaluate(async () => {
    await window.rtTeste.iniciarDados();
    window.rtTeste.sincronizarAbas();
  });
  const second = await context.newPage();
  second.on("pageerror", (e) => errors.push(e.message));
  await second.goto("http://127.0.0.1:3000");
  await second.getByRole("heading", { name: /SEU PRÓXIMO/ }).waitFor();
  await second.addScriptTag({ content: bundled.outputFiles[0].text });
  await second.evaluate(async () => {
    await window.rtTeste.iniciarDados();
    window.rtTeste.sincronizarAbas();
  });
  const result = await p.evaluate(() => {
    const {
      motoRepository: r,
      configRepository: config,
      cliqueRepository: cliques,
    } = window.rtTeste;
    r.atualizar("RT-012", { preco: 19500 });
    const copia = r.duplicar("RT-012");
    const original = r.obter("RT-012");
    if (
      copia.codigo !== "RT-023" ||
      copia.publicacao !== "rascunho" ||
      copia.id === original.id
    )
      throw new Error("Duplicação inconsistente");
    r.excluirRascunho(copia.id);
    r.alterarStatus("RT-020", { disponibilidade: "reservada" });
    r.arquivar("RT-020");
    r.arquivar("RT-020", false);
    config.atualizar({ nome: "RT Motos — teste" });
    cliques.registrar("interesse", "RT-012");
    let recusou = false;
    try {
      r.excluirRascunho("RT-012");
    } catch {
      recusou = true;
    }
    return { preco: original.preco, recusou };
  });
  assert.equal(result.preco, 19500);
  assert.equal(result.recusou, true);
  await second.waitForFunction(
    () => window.rtTeste.motoRepository.obter("RT-012").preco === 19500,
  );
  assert.equal(
    await second.evaluate(() => window.rtTeste.configRepository.obter().nome),
    "RT Motos — teste",
  );
  await p.reload();
  await p.addScriptTag({ content: bundled.outputFiles[0].text });
  await p.evaluate(() => window.rtTeste.iniciarDados());
  assert.equal(
    await p.evaluate(() => window.rtTeste.motoRepository.obter("RT-012").preco),
    19500,
  );
  const foto = await p.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 2000;
    canvas.height = 1000;
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    const src = await window.rtTeste.salvarFoto(
      new File([blob], "foto.png", { type: "image/png" }),
    );
    const saved = await window.rtTeste.lerFoto(src);
    const bitmap = await createImageBitmap(saved);
    const result = {
      src,
      largura: bitmap.width,
      altura: bitmap.height,
      tipo: saved.type,
    };
    bitmap.close();
    return result;
  });
  assert.equal(foto.largura, 1600);
  assert.equal(foto.altura, 800);
  assert.equal(foto.tipo, "image/jpeg");
  assert.ok(foto.src.startsWith("idb:"));
  await p
    .getByRole("button", { name: "Restaurar dados de exemplo", exact: true })
    .click();
  await p.getByRole("button", { name: "Cancelar", exact: true }).click();
  assert.equal(
    await p.evaluate(() => window.rtTeste.motoRepository.obter("RT-012").preco),
    19500,
  );
  await p
    .getByRole("button", { name: "Restaurar dados de exemplo", exact: true })
    .click();
  await p.getByRole("button", { name: "Restaurar dados", exact: true }).click();
  await p.getByText("Dados de exemplo restaurados.").waitFor();
  await second.waitForFunction(
    () => window.rtTeste.motoRepository.obter("RT-012").preco === 18900,
  );
  assert.equal(
    await p.evaluate(
      (src) => window.rtTeste.lerFoto(src).then((v) => v === undefined),
      foto.src,
    ),
    true,
  );
  await p.setViewportSize({ width: 390, height: 844 });
  await p.screenshot({ path: "test-results/base-mobile.png", fullPage: true });
  assert.equal(
    await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    false,
  );
  await p.setViewportSize({ width: 375, height: 812 });
  assert.equal(
    await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    false,
  );
  await p.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await p
      .locator(".border-beam").first()
      .evaluate((el) => getComputedStyle(el).display),
    "none",
  );
  await p.getByRole("link", { name: "Acesso da loja ↗", exact: true }).click();
  await p
    .getByRole("heading", { name: "Bem-vindo ao painel." })
    .waitFor();
  // Fallback de sincronização: mesmo fluxo com BroadcastChannel indisponível.
  const fallback = await browser.newContext();
  await fallback.addInitScript(() => {
    window.BroadcastChannel = undefined;
  });
  const a = await fallback.newPage();
  const b = await fallback.newPage();
  for (const page of [a, b]) {
    await page.goto("http://127.0.0.1:3000");
    await page.addScriptTag({ content: bundled.outputFiles[0].text });
    await page.evaluate(async () => {
      await window.rtTeste.iniciarDados();
      window.rtTeste.sincronizarAbas();
    });
  }
  await a.evaluate(() =>
    window.rtTeste.motoRepository.atualizar("RT-012", { preco: 19900 }),
  );
  await b.waitForFunction(
    () => window.rtTeste.motoRepository.obter("RT-012").preco === 19900,
  );
  await fallback.close();
  assert.deepEqual(errors, []);
  await fs.writeFile(
    "test-results/browser.json",
    JSON.stringify(
      {
        ok: true,
        checks: [
          "CRUD",
          "persistência/reload",
          "sincronização BroadcastChannel",
          "fallback storage",
          "compressão JPEG/IndexedDB",
          "cancelar/restaurar e limpar fotos",
          "375/390/1440px",
          "movimento reduzido",
          "navegação",
          "sem pageerror",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    "Navegador: todos os cenários passaram. Capturas em test-results/.",
  );
} finally {
  await context.close();
  await browser.close();
}
