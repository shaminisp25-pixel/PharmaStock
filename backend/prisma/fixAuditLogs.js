const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Adding changes column to audit_logs if missing...');
    await prisma.$executeRawUnsafe(`ALTER TABLE IF EXISTS "audit_logs" ADD COLUMN IF NOT EXISTS "changes" JSONB DEFAULT '{}'::jsonb;`);
    console.log('Done.');
  } catch (e) {
    console.error('Error adding column:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
