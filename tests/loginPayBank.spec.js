import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { obterCodigo2FA, obterUltimoId2FA, closeDb } from '../support/db';
import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';

const usuario = {
  cpf: process.env.USER_CPF || '00000014141',
  senha: process.env.USER_PASSWORD || '147258',
};

test.describe('Login PayBank', () => {
  // Os dois testes usam o mesmo usuário e geram códigos 2FA para ele.
  // Rodam em sequência (mesmo worker) para um não invalidar o código do outro.
  test.describe.configure({ mode: 'default' });

  /** @type {LoginPage} */
  let loginPage;
  /** @type {DashPage} */
  let dashPage;

  test.beforeEach(async ({ page }) => {
    await allure.epic('PayBank');
    await allure.feature('Autenticação');
    await allure.story('Login com 2FA');
    await allure.owner('Rafael Cantieri');

    loginPage = new LoginPage(page);
    dashPage = new DashPage(page);
  });

  test.afterAll(async () => {
    await closeDb();
  });

  test('Não deve logar quando o código de verificação for inválido', async () => {
    await allure.severity(allure.Severity.CRITICAL);
    await allure.tags('login', '2fa', 'negativo');

    await loginPage.loginUntil2FA(usuario);
    await loginPage.enterCodeFA('123456');

    await loginPage.expectToastMessage('Código inválido. Por favor, tente novamente.');
  });

  test('Deve acessar a conta do usuário', async () => {
    await allure.severity(allure.Severity.BLOCKER);
    await allure.tags('login', '2fa', 'positivo', 'smoke');

    const ultimoId = await obterUltimoId2FA(usuario.cpf);

    await loginPage.loginUntil2FA(usuario);

    const code = await test.step('Obter o código 2FA no banco de dados', () =>
      obterCodigo2FA(usuario.cpf, ultimoId)
    );

    await loginPage.enterCodeFA(code);

    await dashPage.expectLoggedIn();
    await dashPage.checkBalance('R$ 5.000,00');
  });
});
