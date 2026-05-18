# Database Setup & Configuration

## ✅ Database Successfully Configured with Supabase PostgreSQL

### Database Details
- **Provider**: PostgreSQL 15+
- **Host**: db.vkykyjnceobchyjiknhw.supabase.co
- **Port**: 5432
- **Database**: postgres
- **Connection**: Secure SSL Connection

---

## 📊 Database Schema

### 8 Core Models Created

#### 1. **users**
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (Enum: admin, pharmacist, warehouse_staff, inspector)
- `warehouse_id` (UUID, Foreign Key - Optional)
- `is_active` (Boolean, Default: true)
- `created_at`, `updated_at` (Timestamps)
- **Indexes**: email

#### 2. **warehouses**
- `id` (UUID, Primary Key)
- `name` (String)
- `location` (String)
- `temp_min`, `temp_max` (Float)
- `created_at`, `updated_at` (Timestamps)
- **Relations**: Users (1-to-Many), Batches (1-to-Many)

#### 3. **drugs**
- `id` (UUID, Primary Key)
- `name` (String)
- `composition` (String)
- `manufacturer` (String)
- `category` (String)
- `temp_min`, `temp_max` (Float)
- `storage_notes` (String)
- `created_at`, `updated_at` (Timestamps)
- **Indexes**: name, manufacturer
- **Relations**: Batches (1-to-Many)

#### 4. **batches**
- `id` (UUID, Primary Key)
- `drug_id` (UUID, Foreign Key)
- `batch_no` (String, Unique)
- `quantity` (Integer)
- `expiry_date` (DateTime)
- `warehouse_id` (UUID, Foreign Key)
- `status` (Enum: active, dispatched, expired, quarantined)
- `imported_by_id` (UUID, Foreign Key - Optional)
- `imported_at`, `updated_at` (Timestamps)
- **Indexes**: expiry_date, status, warehouse_id
- **Relations**: Drug, Warehouse, User (ImportedBy), Dispatch Records, Alerts

#### 5. **dispatch_records**
- `id` (UUID, Primary Key)
- `batch_id` (UUID, Foreign Key)
- `quantity_dispatched` (Integer)
- `destination` (String)
- `prescription_ref` (String)
- `dispatched_by_id` (UUID, Foreign Key)
- `dispatched_at` (DateTime)
- **Indexes**: batch_id, dispatched_at
- **Relations**: Batch, User (DispatchedBy)

#### 6. **import_logs**
- `id` (UUID, Primary Key)
- `filename` (String)
- `total_rows`, `success_rows`, `failed_rows` (Integer)
- `errors` (JSON Array)
- `uploaded_by_id` (UUID, Foreign Key)
- `uploaded_at` (DateTime)
- **Indexes**: uploaded_at
- **Relations**: User (UploadedBy)

#### 7. **audit_logs**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `action` (String: CREATE, READ, UPDATE, DELETE)
- `entity_type` (String: User, Warehouse, Drug, Batch, etc.)
- `entity_id` (UUID)
- `before_state` (JSON)
- `after_state` (JSON)
- `ip_address` (String)
- `user_agent` (String)
- `created_at` (DateTime)
- **Indexes**: entity_type + entity_id, user_id
- **Relations**: User

#### 8. **alerts**
- `id` (UUID, Primary Key)
- `batch_id` (UUID, Foreign Key)
- `alert_type` (Enum: near_expiry, expired, low_stock, temp_breach)
- `resolved` (Boolean, Default: false)
- `resolved_at` (DateTime, Optional)
- `triggered_at` (DateTime)
- **Indexes**: resolved, batch_id
- **Relations**: Batch

---

## 📝 Enumerations

### Role Enum
```
- admin           (Full system access)
- pharmacist      (Drug & batch management)
- warehouse_staff (Warehouse operations)
- inspector       (Read-only audit access)
```

### BatchStatus Enum
```
- active          (Available for dispatch)
- dispatched      (Already sent out)
- expired         (Past expiry date)
- quarantined     (Held for inspection)
```

### AlertType Enum
```
- near_expiry     (30/60/90 days before expiry)
- expired         (Past expiry date)
- low_stock       (Below minimum threshold)
- temp_breach     (Temperature violation)
```

---

## 🌱 Seeded Test Data

### Users (5)
| Email | Role | Password | Warehouse |
|-------|------|----------|-----------|
| admin@pharmastock.com | Admin | SecurePass123! | - |
| sarah@pharmastock.com | Pharmacist | SecurePass123! | - |
| ahmed@pharmastock.com | Warehouse Staff | SecurePass123! | Main Warehouse - Dubai |
| fatima@pharmastock.com | Warehouse Staff | SecurePass123! | Cold Storage - Sharjah |
| hassan@pharmastock.com | Inspector | SecurePass123! | - |

### Warehouses (3)
1. Main Warehouse - Dubai (15-25°C)
2. Cold Storage - Sharjah (2-8°C)
3. Secondary Hub - Abu Dhabi (15-25°C)

### Drugs (5)
1. Aspirin 500mg (Bayer Healthcare)
2. Insulin 100IU (Novo Nordisk)
3. Amoxicillin 500mg (GSK)
4. Paracetamol 650mg (Johnson & Johnson)
5. Lisinopril 10mg (Cipla)

### Batches (5)
- 2 Active batches
- 1 Expired batch
- 2 Near-expiry batches (with alerts)

### Alerts (3)
- 1 Near-expiry alert (90 days)
- 1 Near-expiry alert (30 days)
- 1 Expired alert

### Other Data
- 2 Dispatch records
- 1 Audit log entry
- 1 Import log entry

---

## 🔑 Access Credentials

### Test Login Credentials
```
Email: admin@pharmastock.com
Password: SecurePass123!
Role: Admin (Full Access)
```

### Other Test Users
All test users use the same password: **SecurePass123!**
- sarah@pharmastock.com (Pharmacist)
- ahmed@pharmastock.com (Warehouse Staff)
- fatima@pharmastock.com (Warehouse Staff)
- hassan@pharmastock.com (Inspector)

---

## 📦 Database Commands

### Prisma Commands
```bash
# Generate Prisma Client
npm run prisma:generate

# Create migrations (development)
npm run prisma:migrate

# Seed database with test data
npm run seed

# Open Prisma Studio (visual database editor)
npm run prisma:studio

# View database in browser
npm run prisma:studio
```

### Using Supabase Dashboard
1. Go to https://supabase.com
2. Login with your account
3. Select your project
4. Navigate to "SQL Editor" or "Database" tab
5. View tables and data in real-time

---

## 🔗 Database Relationships

```
User
├── warehouses (Many-to-One)
├── importLogs (One-to-Many)
├── auditLogs (One-to-Many)
└── dispatches (One-to-Many)

Warehouse
├── users (One-to-Many)
└── batches (One-to-Many)

Drug
└── batches (One-to-Many)

Batch
├── drug (Many-to-One)
├── warehouse (Many-to-One)
├── importedBy user (Many-to-One)
├── dispatches (One-to-Many)
└── alerts (One-to-Many)

DispatchRecord
├── batch (Many-to-One)
└── dispatchedBy user (Many-to-One)

ImportLog
└── uploadedBy user (Many-to-One)

AuditLog
└── user (Many-to-One)

Alert
└── batch (Many-to-One)
```

---

## 🔐 Security Features

### Database Level
- ✅ Encrypted connections (SSL/TLS)
- ✅ UUID primary keys (hard to guess IDs)
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Audit logging for all changes
- ✅ Foreign key constraints
- ✅ Role-based access control

### Application Level
- ✅ JWT authentication
- ✅ Token refresh mechanism
- ✅ Rate limiting
- ✅ Input validation with Zod
- ✅ SQL injection prevention
- ✅ CORS protection

---

## 📊 Database Statistics

| Metric | Value |
|--------|-------|
| Total Tables | 8 |
| Total Enums | 3 |
| Total Relationships | 12 |
| Total Indexes | 10+ |
| Test Users | 5 |
| Test Warehouses | 3 |
| Test Drugs | 5 |
| Test Batches | 5 |
| Test Alerts | 3 |

---

## 🚀 Accessing the Database

### Via Prisma Studio
```bash
npm run prisma:studio
# Opens at http://localhost:5555
```

### Via Supabase Dashboard
1. Go to https://supabase.com
2. Log in to your account
3. Select your project
4. Use the SQL Editor to run queries

### Sample Query
```sql
-- Get all active batches expiring soon
SELECT b.*, d.name, w.name 
FROM batches b
JOIN drugs d ON b.drug_id = d.id
JOIN warehouses w ON b.warehouse_id = w.id
WHERE b.status = 'active' 
AND b.expiry_date BETWEEN NOW() AND NOW() + INTERVAL '30 days'
ORDER BY b.expiry_date ASC;
```

---

## ⚠️ Important Notes

1. **Database URL** is securely stored in `.env` file
2. **Never commit** `.env` file to version control
3. **Test credentials** should be changed in production
4. **Backups** are handled by Supabase automatically
5. **Database scaling** can be managed via Supabase dashboard
6. **Connection pooling** is enabled for optimal performance

---

## 🔄 Next Steps

1. ✅ Database schema created in Supabase
2. ✅ Test data seeded
3. ✅ Prisma Client generated
4. Next: Run backend server (`npm run dev`)
5. Next: Connect frontend to backend
6. Next: Test APIs with Postman/REST Client

---

## 📞 Troubleshooting

### Connection Issues
- Verify DATABASE_URL in .env
- Check Supabase project is active
- Ensure IP is whitelisted (Supabase handles this)
- Test connection: `psql postgresql://...`

### Schema Issues
- Regenerate Prisma Client: `npm run prisma:generate`
- Check Prisma schema: `prisma/schema.prisma`
- View in Prisma Studio: `npm run prisma:studio`

### Data Issues
- Verify seed script ran successfully
- Check for constraint violations
- Review audit logs for changes
- Use Prisma Studio to inspect data

---

**Database Setup Complete! Ready for Backend & Frontend Integration** ✨
