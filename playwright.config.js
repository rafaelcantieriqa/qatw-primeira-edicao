// @ts-check
import 'dotenv/config';
import os from 'node:os';
import { defineConfig, devices } from '@playwright/test';
import { startAllureWatchInUiMode } from './scripts/allure-ui-watch.mjs';

/* No modo UI (npx playwright test --ui) abre o Allure atualizando em tempo real */
startAllureWatchInUiMode();

const BASE_URL = process.env.BASE_URL || 'http://paybank-mf-auth:3000';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  /* Falha o build no CI se alguém esquecer um test.only */
  forbidOnly: !!process.env.CI,
  /* Retry apenas no CI */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    /* No CI: anotações nos testes que falharem + JUnit para o resumo gráfico do GitHub */
    ...(process.env.CI ? [['github']] : []),
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['html', { open: 'never' }],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: true,
      environmentInfo: {
        os_platform: os.platform(),
        node_version: process.version,
        base_url: BASE_URL,
        ci: process.env.CI ? 'true' : 'false',
      },
    }],
  ],

  use: {
    baseURL: BASE_URL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    /* Evidências: anexadas automaticamente ao Allure quando o teste falha */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
