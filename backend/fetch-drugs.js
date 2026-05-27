const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fetchDrugs() {
  try {
    const drugs = await prisma.drug.findMany({
      include: {
        batches: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log(JSON.stringify(drugs, null, 2));
  } catch (error) {
    console.error('Error fetching drugs:', error.message || error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchDrugs();
