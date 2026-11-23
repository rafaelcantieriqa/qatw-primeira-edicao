import { test, expect } from '@playwright/test';

export class LoginPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        this.cpfInput = page.getByRole('textbox', { name: 'Digite seu CPF' });
        this.continueButton = page.getByRole('button', { name: 'Continuar' });
        this.passwordHeading = page.getByRole('heading', { name: 'Informe sua senha' });
        this.twoFactorHeading = page.getByRole('heading', { name: 'Verificação em duas etapas' });
        this.twoFactorInput = page.getByRole('textbox', { name: '000000' });
        this.verifyButton = page.getByRole('button', { name: 'Verificar' });
    }

    async accessPage() {
        await test.step('Acessar a página de login', async () => {
            // Usa o baseURL definido no playwright.config.js
            await this.page.goto('/');
            await expect(this.cpfInput).toBeVisible();
        });
    }

    async fillCpf(cpf) {
        await test.step(`Informar o CPF ${cpf}`, async () => {
            await this.cpfInput.fill(cpf);
            await this.continueButton.click();
            await expect(this.passwordHeading).toBeVisible();
        });
    }

    async fillPassword(password) {
        // A senha é digitada em um teclado virtual (ordem aleatória dos botões).
        // O valor não é exibido no relatório por segurança.
        await test.step('Informar a senha no teclado virtual', async () => {
            for (const digito of String(password)) {
                await this.page.getByRole('button', { name: digito, exact: true }).click();
            }

            // Só valida depois de digitar todos os dígitos: antes disso o
            // botão fica desabilitado de propósito (senha incompleta).
            await expect(this.continueButton).toBeEnabled();
            await this.continueButton.click();
            await expect(this.twoFactorHeading).toBeVisible();
        });
    }

    async enterCodeFA(code) {
        await test.step('Informar o código de verificação (2FA)', async () => {
            await this.twoFactorInput.fill(code);
            await this.verifyButton.click();
        });
    }

    async expectToastMessage(message) {
        await test.step(`Validar a mensagem: "${message}"`, async () => {
            await expect(this.page.getByText(message)).toBeVisible();
        });
    }


    async loginUntil2FA(usuario) {
        await this.accessPage();
        await this.fillCpf(usuario.cpf);
        await this.fillPassword(usuario.senha);
    }
}
