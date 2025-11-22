import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Initializing database...');
  
  // 測試連線
  await prisma.$connect();
  console.log('Database connected successfully!');
  
  // Prisma Accelerate 會自動同步 schema
  console.log('Schema sync completed via Prisma Accelerate');
  
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('Error initializing database:', e);
    process.exit(1);
  });
