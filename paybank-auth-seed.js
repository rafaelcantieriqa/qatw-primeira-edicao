import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = '147258';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { cpf: '00000014141' },
    update: { passwordHash },
    create: {
      cpf: '00000014141',
      email: 'eu@fernandopapito.com.br',
      passwordHash,
      name: 'Fernando Papito',
    },
  });

  console.log(`Seed concluído para o usuário id=${user.id}`);
}

main()
  .catch((error) => {
    console.error('Falha ao executar o seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
