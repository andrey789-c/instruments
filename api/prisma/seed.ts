import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
  const exists = await prisma.user.findUnique({ where: { email: 'root@example.com' }});
  if (!exists) {
    await prisma.user.create({
      data: {
        email: 'root@example.com',
        password: await bcrypt.hash('supersecurepassword', 10),
        role: 'SUPERADMIN',
        organizationName: 'Andrew company',
        ownerId: null
      }
    });
    console.log('Created superadmin root@example.com');
  } else {
    console.log('Superadmin exists');
  }
}

main().finally(() => prisma.$disconnect());
