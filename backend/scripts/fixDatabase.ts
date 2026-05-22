#!/usr/bin/env node
/**
 * Quick fix: Add missing 'changes' column to audit_logs table
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addChangesColumn() {
  try {
    console.log('🔧 Adding "changes" column to audit_logs table...\n');

    // Add the changes column if it doesn't exist
    await prisma.$executeRawUnsafe(`
      ALTER TABLE audit_logs
      ADD COLUMN IF NOT EXISTS changes JSONB DEFAULT '{}'::jsonb;
    `);

    console.log('✅ Column "changes" added successfully to audit_logs table\n');
    
    // Verify the column exists
    const result: any = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'audit_logs' AND column_name = 'changes';
    `);

    if (result && Array.isArray(result) && result.length > 0) {
      console.log('✅ Verification successful:');
      console.log(`   Column: ${result[0].column_name}`);
      console.log(`   Type: ${result[0].data_type}\n`);
    }

    console.log('🎉 Database schema is now synchronized!\n');
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('✅ Column "changes" already exists in audit_logs table\n');
    } else {
      console.error('❌ Error adding column:', error);
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addChangesColumn();
