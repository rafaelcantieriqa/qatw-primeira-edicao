import { expect } from '@playwright/test';
import pgPromise from 'pg-promise';

const pgp = pgPromise();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://dba:dba@paybank-db:5432/UserDB';

const db = pgp(DATABASE_URL);

/**
 * Retorna o maior id de código 2FA já gerado para o usuário.
 * Usado como "marcador" antes do login, para garantir que o código lido
 * depois seja realmente o novo (e não um código antigo de outra execução).
 */
export async function obterUltimoId2FA(cpf) {
    const result = await db.one(
        `SELECT COALESCE(MAX(t.id), 0) AS id
           FROM public."TwoFactorCode" t
           JOIN public."User" u ON u.id = t."userId"
          WHERE u.cpf = $1`,
        [cpf]
    );
    return Number(result.id);
}

/**
 * Aguarda (polling) até que um novo código 2FA, ainda não usado, seja gerado
 * para o CPF informado e o retorna. Substitui os waitForTimeout fixos.
 *
 * @param {string} cpf
 * @param {number} aPartirDoId  id retornado por obterUltimoId2FA antes do login
 */
export async function obterCodigo2FA(cpf, aPartirDoId = 0) {
    let code = null;

    await expect.poll(async () => {
        const result = await db.oneOrNone(
            `SELECT t.code
               FROM public."TwoFactorCode" t
               JOIN public."User" u ON u.id = t."userId"
              WHERE u.cpf = $1
                AND t.id > $2
                AND t."isUsed" = false
              ORDER BY t.id DESC
              LIMIT 1`,
            [cpf, aPartirDoId]
        );
        code = result?.code ?? null;
        return code;
    }, {
        message: `Nenhum código 2FA novo encontrado para o CPF ${cpf}`,
        timeout: 10_000,
    }).not.toBeNull();

    return code;
}

export async function closeDb() {
    await pgp.end();
}
