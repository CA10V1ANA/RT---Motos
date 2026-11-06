import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const chrome = await chromium.launch({ headless: true, args: ['--remote-debugging-port=9222'] });
try {
  await fs.mkdir('test-results', { recursive: true }); const resultados = [];
  for (const [nome, path] of [['catalogo', '/'], ['moto', '/motos/honda-nxr-160-bros-2024-rt-012']]) {
    const result = await lighthouse(`http://127.0.0.1:3000${path}`, { port: 9222, logLevel: 'error', output: ['json', 'html'], onlyCategories: ['performance', 'accessibility'], formFactor: 'mobile' });
    const metricas = { pagina: path, performance: Math.round(result.lhr.categories.performance.score * 100), acessibilidade: Math.round(result.lhr.categories.accessibility.score * 100), lcp: result.lhr.audits['largest-contentful-paint'].displayValue, cls: result.lhr.audits['cumulative-layout-shift'].displayValue };
    resultados.push(metricas); await fs.writeFile(`test-results/lighthouse-${nome}.json`, result.report[0]); await fs.writeFile(`test-results/lighthouse-${nome}.html`, result.report[1]); console.log(metricas);
  }
  await fs.writeFile('test-results/lighthouse-resumo.json', JSON.stringify(resultados, null, 2));
  if (resultados.some(r => r.performance < 85 || r.acessibilidade < 95)) process.exitCode = 1;
} finally { await chrome.close(); }
