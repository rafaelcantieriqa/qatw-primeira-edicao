// Abre o Allure em tempo real quando os testes rodam no modo UI (`npx playwright test --ui`).
//
// O modo UI executa os reporters do playwright.config, então cada execução feita na UI
// grava em ./allure-results. Aqui iniciamos `allure watch`, que observa essa pasta,
// atualiza o relatório a cada novo resultado e já abre no navegador.
//
// O relatório é gerado numa pasta temporária do sistema (fora do OneDrive), pelo mesmo
// motivo descrito em scripts/test-with-report.mjs.
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const GUARD = 'PW_ALLURE_UI_WATCH';

export function startAllureWatchInUiMode() {
  const isUiMode = process.argv.includes('--ui') || process.argv.some((a) => a.startsWith('--ui-'));
  // O config é recarregado a cada execução na UI e também pelos workers (que herdam o env):
  // a variável de ambiente garante um único `allure watch` por sessão.
  if (!isUiMode || process.env.CI || process.env[GUARD]) return;
  process.env[GUARD] = '1';

  // Caminho direto: o Playwright transpila o config para CommonJS (sem import.meta)
  // e o pacote allure não exporta o package.json para require.resolve.
  const allureCli = path.resolve('node_modules', 'allure', 'cli.js');
  const outputDir = path.join(os.tmpdir(), 'allure-report-ui');

  const watcher = spawn(
    process.execPath,
    [allureCli, 'watch', './allure-results', '--output', outputDir, '--open', '--preserve'],
    { stdio: 'inherit' },
  );
  watcher.on('error', (err) => console.error('[allure] Falha ao iniciar o allure watch:', err.message));

  // Encerra o servidor do Allure junto com o modo UI.
  const stop = () => { if (!watcher.killed) watcher.kill(); };
  process.on('exit', stop);
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => { stop(); process.exit(); });
  }
}
