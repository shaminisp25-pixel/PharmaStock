import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create Warehouses
  console.log('📦 Creating warehouses...');
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: 'Main Warehouse - Dubai',
      location: 'Dubai Industrial Area',
      tempMin: 15,
      tempMax: 25,
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: 'Cold Storage - Sharjah',
      location: 'Sharjah Port',
      tempMin: 2,
      tempMax: 8,
    },
  });

  const warehouse3 = await prisma.warehouse.create({
    data: {
      name: 'Secondary Hub - Abu Dhabi',
      location: 'Abu Dhabi',
      tempMin: 15,
      tempMax: 25,
    },
  });

  console.log('✅ Warehouses created:', {
    warehouse1: warehouse1.name,
    warehouse2: warehouse2.name,
    warehouse3: warehouse3.name,
  });

  // Create Users
  console.log('\n👥 Creating users...');
  const hashedPassword = await bcrypt.hash('SecurePass123!', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@pharmastock.com',
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: true,
    },
  });

  const pharmacist = await prisma.user.create({
    data: {
      name: 'Dr. Sarah Pharmacist',
      email: 'sarah@pharmastock.com',
      passwordHash: hashedPassword,
      role: 'pharmacist',
      isActive: true,
    },
  });

  const warehouse_staff1 = await prisma.user.create({
    data: {
      name: 'Ahmed Warehouse Manager',
      email: 'ahmed@pharmastock.com',
      passwordHash: hashedPassword,
      role: 'warehouse_staff',
      warehouseId: warehouse1.id,
      isActive: true,
    },
  });

  const warehouse_staff2 = await prisma.user.create({
    data: {
      name: 'Fatima Cold Storage Manager',
      email: 'fatima@pharmastock.com',
      passwordHash: hashedPassword,
      role: 'warehouse_staff',
      warehouseId: warehouse2.id,
      isActive: true,
    },
  });

  const inspector = await prisma.user.create({
    data: {
      name: 'Inspector Hassan',
      email: 'hassan@pharmastock.com',
      passwordHash: hashedPassword,
      role: 'inspector',
      isActive: true,
    },
  });

  console.log('✅ Users created:', {
    admin: admin.email,
    pharmacist: pharmacist.email,
    warehouse_staff1: warehouse_staff1.email,
    warehouse_staff2: warehouse_staff2.email,
    inspector: inspector.email,
  });

  // Create Drugs
  console.log('\n💊 Creating drugs...');
  const drug1 = await prisma.drug.create({
    data: {
      name: 'Aspirin 500mg',
      composition: 'Acetylsalicylic Acid',
      manufacturer: 'Bayer Healthcare',
      category: 'Pain Relief',
      tempMin: 15,
      tempMax: 25,
      storageNotes: 'Keep in dry place',
    },
  });

  const drug2 = await prisma.drug.create({
    data: {
      name: 'Insulin 100IU',
      composition: 'Human Insulin',
      manufacturer: 'Novo Nordisk',
      category: 'Diabetes',
      tempMin: 2,
      tempMax: 8,
      storageNotes: 'Keep refrigerated',
    },
  });

  const drug3 = await prisma.drug.create({
    data: {
      name: 'Amoxicillin 500mg',
      composition: 'Amoxicillin Trihydrate',
      manufacturer: 'GSK',
      category: 'Antibiotics',
      tempMin: 15,
      tempMax: 25,
      storageNotes: 'Protect from moisture',
    },
  });

  const drug4 = await prisma.drug.create({
    data: {
      name: 'Paracetamol 650mg',
      composition: 'Paracetamol',
      manufacturer: 'Johnson & Johnson',
      category: 'Fever & Pain',
      tempMin: 15,
      tempMax: 25,
      storageNotes: 'Standard storage',
    },
  });

  const drug5 = await prisma.drug.create({
    data: {
      name: 'Lisinopril 10mg',
      composition: 'Lisinopril Dihydrate',
      manufacturer: 'Cipla',
      category: 'Cardiovascular',
      tempMin: 15,
      tempMax: 25,
      storageNotes: 'Keep in cool place',
    },
  });

  console.log('✅ Drugs created:', {
    drug1: drug1.name,
    drug2: drug2.name,
    drug3: drug3.name,
    drug4: drug4.name,
    drug5: drug5.name,
  });

  // Create Batches
  console.log('\n📋 Creating batches...');
  const now = new Date();
  
  const batch1 = await prisma.batch.create({
    data: {
      drugId: drug1.id,
      batchNo: 'BATCH-ASP-2024-001',
      quantity: 5000,
      expiryDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year
      warehouseId: warehouse1.id,
      status: 'active',
      importedById: pharmacist.id,
    },
  });

  const batch2 = await prisma.batch.create({
    data: {
      drugId: drug2.id,
      batchNo: 'BATCH-INS-2024-001',
      quantity: 2000,
      expiryDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months
      warehouseId: warehouse2.id,
      status: 'active',
      importedById: pharmacist.id,
    },
  });

  const batch3 = await prisma.batch.create({
    data: {
      drugId: drug3.id,
      batchNo: 'BATCH-AMX-2024-001',
      quantity: 8000,
      expiryDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 3 months (warning level)
      warehouseId: warehouse1.id,
      status: 'active',
      importedById: pharmacist.id,
    },
  });

  const batch4 = await prisma.batch.create({
    data: {
      drugId: drug4.id,
      batchNo: 'BATCH-PAR-2024-001',
      quantity: 10000,
      expiryDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days (critical level)
      warehouseId: warehouse1.id,
      status: 'active',
      importedById: warehouse_staff1.id,
    },
  });

  const batch5 = await prisma.batch.create({
    data: {
      drugId: drug5.id,
      batchNo: 'BATCH-LIS-2024-001',
      quantity: 3500,
      expiryDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago (expired)
      warehouseId: warehouse3.id,
      status: 'expired',
      importedById: warehouse_staff1.id,
    },
  });

  console.log('✅ Batches created:', {
    batch1: batch1.batchNo,
    batch2: batch2.batchNo,
    batch3: batch3.batchNo,
    batch4: batch4.batchNo,
    batch5: batch5.batchNo,
  });

  // Create Alerts
  console.log('\n⚠️  Creating alerts...');
  const alert1 = await prisma.alert.create({
    data: {
      batchId: batch3.id,
      alertType: 'near_expiry',
      resolved: false,
    },
  });

  const alert2 = await prisma.alert.create({
    data: {
      batchId: batch4.id,
      alertType: 'near_expiry',
      resolved: false,
    },
  });

  const alert3 = await prisma.alert.create({
    data: {
      batchId: batch5.id,
      alertType: 'expired',
      resolved: false,
    },
  });

  console.log('✅ Alerts created:', {
    alert1: 'Batch 3 - 90 days to expiry',
    alert2: 'Batch 4 - 30 days to expiry',
    alert3: 'Batch 5 - Already expired',
  });

  // Create Dispatch Records
  console.log('\n📤 Creating dispatch records...');
  const dispatch1 = await prisma.dispatchRecord.create({
    data: {
      batchId: batch1.id,
      quantityDispatched: 500,
      destination: 'Clinic A - Dubai',
      prescriptionRef: 'RX-2024-001',
      dispatchedById: warehouse_staff1.id,
    },
  });

  const dispatch2 = await prisma.dispatchRecord.create({
    data: {
      batchId: batch2.id,
      quantityDispatched: 100,
      destination: 'Hospital B - Abu Dhabi',
      prescriptionRef: 'RX-2024-002',
      dispatchedById: warehouse_staff2.id,
    },
  });

  console.log('✅ Dispatch records created:', {
    dispatch1: `500 units of ${drug1.name}`,
    dispatch2: `100 units of ${drug2.name}`,
  });

  // Create Audit Logs
  console.log('\n📝 Creating audit logs...');
  const auditLog1 = await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'CREATE',
      entityType: 'Batch',
      entityId: batch1.id,
      afterState: {
        batchNo: batch1.batchNo,
        quantity: batch1.quantity,
      },
      ipAddress: '192.168.1.100',
    },
  });

  console.log('✅ Audit logs created');

  // Create Import Log
  console.log('\n📥 Creating import log...');
  const importLog = await prisma.importLog.create({
    data: {
      filename: 'drugs_batch_2024_05.csv',
      totalRows: 150,
      successRows: 148,
      failedRows: 2,
      errors: [
        { row: 45, error: 'Missing manufacturer' },
        { row: 89, error: 'Invalid temperature range' },
      ],
      uploadedById: pharmacist.id,
    },
  });

  console.log('✅ Import log created');

  console.log('\n✨ Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Warehouses: 3`);
  console.log(`   - Users: 5 (Admin, Pharmacist, 2x Warehouse Staff, Inspector)`);
  console.log(`   - Drugs: 5`);
  console.log(`   - Batches: 5`);
  console.log(`   - Alerts: 3`);
  console.log(`   - Dispatch Records: 2`);
  console.log(`   - Audit Logs: 1`);
  console.log(`   - Import Logs: 1`);
  console.log('\n🔐 Test Credentials:');
  console.log(`   Email: admin@pharmastock.com`);
  console.log(`   Password: SecurePass123!`);
  console.log(`   Other emails: sarah@, ahmed@, fatima@, hassan@pharmastock.com`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
