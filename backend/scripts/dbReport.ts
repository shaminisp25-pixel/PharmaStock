#!/usr/bin/env node

/**
 * Database Report Generator
 * Retrieves all data from the database and generates a comprehensive report
 * Usage: npm run db:report or node scripts/dbReport.js
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Get __dirname equivalent in ES modules used with CommonJS
const __dirname = path.join(process.cwd(), 'backend', 'scripts');
const __filename = path.join(__dirname, 'dbReport.ts');

const prisma = new PrismaClient();

interface DatabaseReport {
  timestamp: string;
  summary: Record<string, any>;
  details: Record<string, any>;
  connectionStatus: string;
  error?: string;
}

async function generateReport(): Promise<DatabaseReport> {
  console.log('🔍 Connecting to database...\n');

  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful!\n');

    const report: DatabaseReport = {
      timestamp: new Date().toISOString(),
      connectionStatus: 'CONNECTED',
      summary: {},
      details: {},
    };

    // Get all users
    console.log('📊 Retrieving Users...');
    const users = await prisma.user.findMany({
      include: {
        warehouse: true,
        _count: {
          select: {
            importLogs: true,
            dispatches: true,
            auditLogs: true,
          },
        },
      },
    });
    report.summary['Total Users'] = users.length;
    report.details.users = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      warehouse: u.warehouse?.name || 'None',
      isActive: u.isActive,
      createdAt: u.createdAt,
      statistics: u._count,
    }));
    console.log(`   ✓ Found ${users.length} users\n`);

    // Get all warehouses
    console.log('🏢 Retrieving Warehouses...');
    const warehouses = await prisma.warehouse.findMany({
      include: {
        _count: {
          select: {
            users: true,
            batches: true,
          },
        },
      },
    });
    report.summary['Total Warehouses'] = warehouses.length;
    report.details.warehouses = warehouses.map((w) => ({
      id: w.id,
      name: w.name,
      location: w.location,
      tempRange: `${w.tempMin}°C - ${w.tempMax}°C`,
      createdAt: w.createdAt,
      statistics: w._count,
    }));
    console.log(`   ✓ Found ${warehouses.length} warehouses\n`);

    // Get all drugs
    console.log('💊 Retrieving Drugs...');
    const drugs = await prisma.drug.findMany({
      include: {
        _count: {
          select: {
            batches: true,
          },
        },
      },
    });
    report.summary['Total Drugs'] = drugs.length;
    report.details.drugs = drugs.map((d) => ({
      id: d.id,
      name: d.name,
      manufacturer: d.manufacturer,
      composition: d.composition,
      category: d.category,
      tempRange: `${d.tempMin}°C - ${d.tempMax}°C`,
      createdAt: d.createdAt,
      statistics: d._count,
    }));
    console.log(`   ✓ Found ${drugs.length} drugs\n`);

    // Get all batches
    console.log('📦 Retrieving Batches...');
    const batches = await prisma.batch.findMany({
      include: {
        drug: true,
        warehouse: true,
        importedBy: true,
        _count: {
          select: {
            dispatches: true,
            alerts: true,
          },
        },
      },
      orderBy: { expiryDate: 'asc' },
    });
    report.summary['Total Batches'] = batches.length;

    // Calculate batch statistics
    const batchStats = {
      active: batches.filter((b) => b.status === 'active').length,
      dispatched: batches.filter((b) => b.status === 'dispatched').length,
      expired: batches.filter((b) => b.status === 'expired').length,
      quarantined: batches.filter((b) => b.status === 'quarantined').length,
    };
    report.summary['Batch Status'] = batchStats;

    report.details['batchStats'] = batchStats;
    report.details.batches = batches.map((b) => ({
      id: b.id,
      batchNo: b.batchNo,
      drug: b.drug.name,
      quantity: b.quantity,
      status: b.status,
      warehouse: b.warehouse.name,
      expiryDate: b.expiryDate,
      importedBy: b.importedBy?.name || 'System',
      importedAt: b.importedAt,
      daysUntilExpiry: Math.ceil(
        (new Date(b.expiryDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      statistics: b._count,
    }));
    console.log(`   ✓ Found ${batches.length} batches`);
    console.log(`     - Active: ${batchStats.active}`);
    console.log(`     - Dispatched: ${batchStats.dispatched}`);
    console.log(`     - Expired: ${batchStats.expired}`);
    console.log(`     - Quarantined: ${batchStats.quarantined}\n`);

    // Get all dispatch records
    console.log('🚚 Retrieving Dispatch Records...');
    const dispatches = await prisma.dispatchRecord.findMany({
      include: {
        batch: {
          include: {
            drug: true,
          },
        },
        dispatchedBy: true,
      },
      orderBy: { dispatchedAt: 'desc' },
    });
    report.summary['Total Dispatch Records'] = dispatches.length;
    report.details.dispatches = dispatches.map((d) => ({
      id: d.id,
      batchNo: d.batch.batchNo,
      drug: d.batch.drug.name,
      quantityDispatched: d.quantityDispatched,
      destination: d.destination,
      prescriptionRef: d.prescriptionRef || 'N/A',
      dispatchedBy: d.dispatchedBy.name,
      dispatchedAt: d.dispatchedAt,
    }));
    console.log(`   ✓ Found ${dispatches.length} dispatch records\n`);

    // Get all alerts
    console.log('⚠️  Retrieving Alerts...');
    const alerts = await prisma.alert.findMany({
      include: {
        batch: {
          include: {
            drug: true,
          },
        },
      },
    });
    report.summary['Total Alerts'] = alerts.length;

    const alertStats = {
      near_expiry: alerts.filter((a) => a.alertType === 'near_expiry').length,
      expired: alerts.filter((a) => a.alertType === 'expired').length,
      low_stock: alerts.filter((a) => a.alertType === 'low_stock').length,
      temp_breach: alerts.filter((a) => a.alertType === 'temp_breach').length,
      resolved: alerts.filter((a) => a.resolvedAt !== null).length,
      pending: alerts.filter((a) => a.resolvedAt === null).length,
    };
    report.details['alertStats'] = alertStats;

    report.details.alerts = alerts.map((a) => ({
      id: a.id,
      alertType: a.alertType,
      batchNo: a.batch?.batchNo || 'N/A',
      drug: a.batch?.drug.name || 'N/A',
      resolved: a.resolved,
      resolvedAt: a.resolvedAt || 'Pending',
      triggeredAt: a.triggeredAt,
    }));
    console.log(`   ✓ Found ${alerts.length} alerts`);
    console.log(`     - Pending: ${alertStats.pending}`);
    console.log(`     - Resolved: ${alertStats.resolved}\n`);

    // Get import logs
    console.log('📥 Retrieving Import Logs...');
    const importLogs = await prisma.importLog.findMany({
      include: {
        uploadedBy: true,
      },
      orderBy: { uploadedAt: 'desc' },
    });
    report.summary['Total Imports'] = importLogs.length;
    report.details.importLogs = importLogs.map((il) => ({
      id: il.id,
      filename: il.filename,
      totalRows: il.totalRows,
      successRows: il.successRows,
      failedRows: il.failedRows,
      successRate: `${((il.successRows / il.totalRows) * 100).toFixed(2)}%`,
      uploadedBy: il.uploadedBy.name,
      uploadedAt: il.uploadedAt,
    }));
    console.log(`   ✓ Found ${importLogs.length} import logs\n`);

    // Get audit logs
    console.log('📋 Retrieving Audit Logs...');
    const auditLogs = await prisma.auditLog.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Last 100 for brevity
    });
    report.summary['Audit Logs (Last 100)'] = auditLogs.length;
    report.details.auditLogs = auditLogs.map((al) => ({
      id: al.id,
      user: al.user.name,
      action: al.action,
      entityType: al.entityType,
      entityId: al.entityId,
      createdAt: al.createdAt,
    }));
    console.log(`   ✓ Found ${auditLogs.length} audit logs (showing last 100)\n`);

    // Summary statistics
    console.log('\n' + '='.repeat(60));
    console.log('📊 DATABASE SUMMARY');
    console.log('='.repeat(60));
    Object.entries(report.summary).forEach(([key, value]) => {
      if (typeof value === 'object') {
        console.log(`${key}:`);
        Object.entries(value).forEach(([k, v]) => {
          console.log(`  - ${k}: ${v}`);
        });
      } else {
        console.log(`${key}: ${value}`);
      }
    });
    console.log('='.repeat(60) + '\n');

    return report;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return {
      timestamp: new Date().toISOString(),
      connectionStatus: 'FAILED',
      summary: {},
      details: {},
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function saveReport(report: DatabaseReport) {
  try {
    const reportDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = path.join(reportDir, `db-report-${timestamp}.json`);

    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`✅ Report saved to: ${filename}\n`);

    // Also save as CSV for easy viewing
    const csvFilename = path.join(reportDir, `db-report-${timestamp}.csv`);
    const csvContent = generateCSVReport(report);
    fs.writeFileSync(csvFilename, csvContent);
    console.log(`✅ CSV report saved to: ${csvFilename}\n`);
  } catch (error) {
    console.error('⚠️  Could not save report:', error);
  }
}

function generateCSVReport(report: DatabaseReport): string {
  let csv = 'PharmaStock Database Report\n';
  csv += `Generated: ${report.timestamp}\n`;
  csv += `Status: ${report.connectionStatus}\n\n`;

  csv += 'SUMMARY\n';
  Object.entries(report.summary).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      csv += `${key},${value}\n`;
    }
  });

  return csv;
}

async function main() {
  const report = await generateReport();
  await saveReport(report);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
