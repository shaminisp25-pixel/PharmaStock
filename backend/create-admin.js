const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('Test@123456', 12);
    const user = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@test.com',
        passwordHash: hashedPassword,
        role: 'admin',
        isActive: true,
      },
    });
    console.log('Admin user created:', user);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('User already exists');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
