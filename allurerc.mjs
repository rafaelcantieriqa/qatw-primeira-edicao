import { defineConfig } from 'allure';

export default defineConfig({
  name: 'PayBank - Testes E2E',
  output: './allure-report',
  historyPath: './allure-history/history.jsonl',
  plugins: {
    awesome: {
      options: {
        reportName: 'PayBank - Testes E2E',
        singleFile: false,
        groupBy: ['epic', 'feature', 'story'],
      },
    },
  },
});
