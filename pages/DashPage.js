import { test, expect } from '@playwright/test';

export class DashPage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        this.balance = page.locator('#account-balance');
        this.balanceHeading = page.getByRole('heading', { name: 'Saldo disponível' });
        this.logoutButton = page.getByRole('button', { name: 'Sair' });
    }

    async expectLoggedIn() {
        await test.step('Validar que o usuário está logado', async () => {
            await expect(this.balanceHeading).toBeVisible({ timeout: 10_000 });
            await expect(this.logoutButton).toBeVisible();
        });
    }

    async checkBalance(expectedBalance) {
        await test.step(`Validar o saldo: ${expectedBalance}`, async () => {
            await expect(this.balance).toHaveText(expectedBalance);
        });
    }
}
