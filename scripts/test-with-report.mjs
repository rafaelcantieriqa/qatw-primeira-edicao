// Roda os testes Playwright e, ao final, abre o relatório Allure no navegador.
// O relatório é aberto mesmo se algum teste falhar. Argumentos extras são repassados
// ao Playwright (ex.: npm test -- tests/loginPayBank.spec.js --headed).
//
// Obs.: o relatório NÃO é gerado dentro do projeto (allure run / allure generate),
// porque a pasta está no OneDrive e a sincronização trava os arquivos durante a
// geração (erro ENOENT ao renomear arquivos em allure-report/awesome).
// `allure open ./allure-results` gera o relatório numa pasta temporária do sistema,
// fora do OneDrive, e já abre no navegador.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync } from 'node:fs';

const run = (cmd, args) =>
  spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' }).status ?? 1;

for (const dir of ['allure-results', 'allure-report']) {
  rmSync(dir, { recursive: true, force: true });
}

const extraArgs = process.argv.slice(2);
const testExitCode = run('npx', ['playwright', 'test', ...extraArgs]);

console.log(`\nTestes finalizados (código de saída: ${testExitCode}).`);

const hasResults = existsSync('allure-results') && readdirSync('allure-results').length > 0;

if (!hasResults) {
  console.error('Nenhum resultado encontrado em ./allure-results — relatório não será aberto.');
} else if (!process.env.CI) {
  console.log('Abrindo relatório Allure... (Ctrl+C para encerrar o servidor)\n');
  run('npx', ['allure', 'open', './allure-results']);
}

process.exit(testExitCode);
