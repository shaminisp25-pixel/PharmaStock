#!/usr/bin/env node

/**
 * User Management Script
 * Create, update, and manage users with different roles
 * Usage: npm run user:create or node scripts/userManagement.js
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function displayMenu() {
  console.log('\n' + '='.repeat(60));
  console.log('👤 USER MANAGEMENT SYSTEM');
  console.log('='.repeat(60));
  console.log('1. Create Super Admin User');
  console.log('2. Create Regular User');
  console.log('3. List All Users');
  console.log('4. Reset User Password');
  console.log('5. Change User Role');
  console.log('6. Deactivate User');
  console.log('7. Exit');
  console.log('='.repeat(60));
}

async function createSuperAdmin() {
  console.log('\n📝 CREATE SUPER ADMIN USER\n');

  const name = await question('Full Name: ');
  const email = await question('Email Address: ');
  const password = await question('Password (min 8 chars): ');

  if (password.length < 8) {
    console.log('❌ Password must be at least 8 characters');
    return;
  }

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('❌ User with this email already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const superAdmin = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: 'admin',
        isActive: true,
      },
    });

    console.log('\n✅ Super Admin user created successfully!');
    console.log('─'.repeat(60));
    console.log(`ID: ${superAdmin.id}`);
    console.log(`Name: ${superAdmin.name}`);
    console.log(`Email: ${superAdmin.email}`);
    console.log(`Role: ${superAdmin.role}`);
    console.log(`Status: ${superAdmin.isActive ? 'Active' : 'Inactive'}`);
    console.log(`Created: ${superAdmin.createdAt}`);
    console.log('─'.repeat(60));

    // Log to audit
    await prisma.auditLog.create({
      data: {
        userId: superAdmin.id,
        action: 'create',
        entityType: 'user',
        entityId: superAdmin.id,
        changes: { created_super_admin: true },
      },
    });
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  }
}

async function createRegularUser() {
  console.log('\n📝 CREATE REGULAR USER\n');

  const name = await question('Full Name: ');
  const email = await question('Email Address: ');
  const password = await question('Password (min 8 chars): ');

  console.log('\nSelect Role:');
  console.log('1. Admin');
  console.log('2. Pharmacist');
  console.log('3. Warehouse Staff');
  console.log('4. Inspector');
  const roleChoice = await question('Enter choice (1-4): ');

  const roleMap: Record<string, 'admin' | 'pharmacist' | 'warehouse_staff' | 'inspector'> = {
    '1': 'admin',
    '2': 'pharmacist',
    '3': 'warehouse_staff',
    '4': 'inspector',
  };

  const role = roleMap[roleChoice];
  if (!role) {
    console.log('❌ Invalid role choice');
    return;
  }

  if (password.length < 8) {
    console.log('❌ Password must be at least 8 characters');
    return;
  }

  let warehouseId: string | undefined;
  if (role === 'warehouse_staff') {
    // List warehouses for assignment
    const warehouses = await prisma.warehouse.findMany();
    if (warehouses.length > 0) {
      console.log('\nSelect Warehouse:');
      warehouses.forEach((w, i) => {
        console.log(`${i + 1}. ${w.name}`);
      });
      const warehouseChoice = await question(`Enter warehouse number (1-${warehouses.length}): `);
      const warehouseIndex = parseInt(warehouseChoice) - 1;
      if (warehouseIndex >= 0 && warehouseIndex < warehouses.length) {
        warehouseId = warehouses[warehouseIndex].id;
      }
    }
  }

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('❌ User with this email already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role,
        warehouseId,
        isActive: true,
      },
      include: {
        warehouse: true,
      },
    });

    console.log('\n✅ User created successfully!');
    console.log('─'.repeat(60));
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Warehouse: ${user.warehouse?.name || 'None'}`);
    console.log(`Status: ${user.isActive ? 'Active' : 'Inactive'}`);
    console.log(`Created: ${user.createdAt}`);
    console.log('─'.repeat(60));
  } catch (error) {
    console.error('❌ Error creating user:', error);
  }
}

async function listUsers() {
  console.log('\n📋 ALL USERS\n');

  try {
    const users = await prisma.user.findMany({
      include: {
        warehouse: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (users.length === 0) {
      console.log('No users found');
      return;
    }

    console.log('─'.repeat(120));
    console.log(
      `${'ID'.padEnd(36)} | ${'Name'.padEnd(20)} | ${'Email'.padEnd(30)} | ${'Role'.padEnd(16)} | ${'Warehouse'.padEnd(15)} | Status`
    );
    console.log('─'.repeat(120));

    users.forEach((user) => {
      console.log(
        `${user.id.substring(0, 8)}... | ${user.name.substring(0, 19).padEnd(20)} | ${user.email.padEnd(30)} | ${user.role.padEnd(16)} | ${(user.warehouse?.name || 'None').substring(0, 14).padEnd(15)} | ${user.isActive ? '✅ Active' : '❌ Inactive'}`
      );
    });

    console.log('─'.repeat(120));
    console.log(`Total: ${users.length} users`);
  } catch (error) {
    console.error('❌ Error listing users:', error);
  }
}

async function resetUserPassword() {
  console.log('\n🔑 RESET USER PASSWORD\n');

  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: 'desc' },
    });

    console.log('Select user:');
    users.forEach((u, i) => {
      console.log(`${i + 1}. ${u.name} (${u.email})`);
    });

    const userChoice = await question(`Enter user number (1-${users.length}): `);
    const userIndex = parseInt(userChoice) - 1;

    if (userIndex < 0 || userIndex >= users.length) {
      console.log('❌ Invalid selection');
      return;
    }

    const selectedUser = users[userIndex];
    const newPassword = await question('New Password (min 8 chars): ');

    if (newPassword.length < 8) {
      console.log('❌ Password must be at least 8 characters');
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: selectedUser.id },
      data: { passwordHash: hashedPassword },
    });

    console.log(`✅ Password reset for ${selectedUser.name}`);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
  }
}

async function changeUserRole() {
  console.log('\n🔄 CHANGE USER ROLE\n');

  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { createdAt: 'desc' },
    });

    console.log('Select user:');
    users.forEach((u, i) => {
      console.log(`${i + 1}. ${u.name} (${u.email}) - Current: ${u.role}`);
    });

    const userChoice = await question(`Enter user number (1-${users.length}): `);
    const userIndex = parseInt(userChoice) - 1;

    if (userIndex < 0 || userIndex >= users.length) {
      console.log('❌ Invalid selection');
      return;
    }

    const selectedUser = users[userIndex];

    console.log('\nSelect New Role:');
    console.log('1. Admin');
    console.log('2. Pharmacist');
    console.log('3. Warehouse Staff');
    console.log('4. Inspector');
    const roleChoice = await question('Enter choice (1-4): ');

    const roleMap: Record<string, 'admin' | 'pharmacist' | 'warehouse_staff' | 'inspector'> = {
      '1': 'admin',
      '2': 'pharmacist',
      '3': 'warehouse_staff',
      '4': 'inspector',
    };

    const newRole = roleMap[roleChoice];
    if (!newRole) {
      console.log('❌ Invalid role choice');
      return;
    }

    await prisma.user.update({
      where: { id: selectedUser.id },
      data: { role: newRole },
    });

    console.log(`✅ Role updated: ${selectedUser.name} - ${selectedUser.role} → ${newRole}`);
  } catch (error) {
    console.error('❌ Error changing role:', error);
  }
}

async function deactivateUser() {
  console.log('\n❌ DEACTIVATE USER\n');

  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: 'desc' },
    });

    if (users.length === 0) {
      console.log('No active users to deactivate');
      return;
    }

    console.log('Select user to deactivate:');
    users.forEach((u, i) => {
      console.log(`${i + 1}. ${u.name} (${u.email})`);
    });

    const userChoice = await question(`Enter user number (1-${users.length}): `);
    const userIndex = parseInt(userChoice) - 1;

    if (userIndex < 0 || userIndex >= users.length) {
      console.log('❌ Invalid selection');
      return;
    }

    const selectedUser = users[userIndex];
    const confirm = await question(`Are you sure? (yes/no): `);

    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled');
      return;
    }

    await prisma.user.update({
      where: { id: selectedUser.id },
      data: { isActive: false },
    });

    console.log(`✅ User deactivated: ${selectedUser.name}`);
  } catch (error) {
    console.error('❌ Error deactivating user:', error);
  }
}

async function main() {
  console.log('\n🎯 PharmaStock User Management System\n');

  let running = true;
  while (running) {
    await displayMenu();
    const choice = await question('Select option (1-7): ');

    switch (choice) {
      case '1':
        await createSuperAdmin();
        break;
      case '2':
        await createRegularUser();
        break;
      case '3':
        await listUsers();
        break;
      case '4':
        await resetUserPassword();
        break;
      case '5':
        await changeUserRole();
        break;
      case '6':
        await deactivateUser();
        break;
      case '7':
        console.log('\n👋 Goodbye!\n');
        running = false;
        break;
      default:
        console.log('❌ Invalid choice');
    }
  }

  rl.close();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
