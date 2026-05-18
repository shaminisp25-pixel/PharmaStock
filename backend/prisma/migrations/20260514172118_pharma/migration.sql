-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'pharmacist', 'warehouse_staff', 'inspector');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('active', 'dispatched', 'expired', 'quarantined');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('near_expiry', 'expired', 'low_stock', 'temp_breach');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "warehouse_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "temp_min" DOUBLE PRECISION NOT NULL,
    "temp_max" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drugs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "composition" TEXT,
    "manufacturer" TEXT NOT NULL,
    "category" TEXT,
    "temp_min" DOUBLE PRECISION NOT NULL,
    "temp_max" DOUBLE PRECISION NOT NULL,
    "storage_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL,
    "drug_id" TEXT NOT NULL,
    "batch_no" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'active',
    "imported_by_id" TEXT,
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispatch_records" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "quantity_dispatched" INTEGER NOT NULL,
    "destination" TEXT NOT NULL,
    "prescription_ref" TEXT,
    "dispatched_by_id" TEXT NOT NULL,
    "dispatched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispatch_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_logs" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "total_rows" INTEGER NOT NULL,
    "success_rows" INTEGER NOT NULL,
    "failed_rows" INTEGER NOT NULL,
    "errors" JSONB NOT NULL DEFAULT '[]',
    "uploaded_by_id" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "before_state" JSONB,
    "after_state" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "alert_type" "AlertType" NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "triggered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "drugs_name_idx" ON "drugs"("name");

-- CreateIndex
CREATE INDEX "drugs_manufacturer_idx" ON "drugs"("manufacturer");

-- CreateIndex
CREATE UNIQUE INDEX "batches_batch_no_key" ON "batches"("batch_no");

-- CreateIndex
CREATE INDEX "batches_expiry_date_idx" ON "batches"("expiry_date");

-- CreateIndex
CREATE INDEX "batches_status_idx" ON "batches"("status");

-- CreateIndex
CREATE INDEX "batches_warehouse_id_idx" ON "batches"("warehouse_id");

-- CreateIndex
CREATE INDEX "dispatch_records_batch_id_idx" ON "dispatch_records"("batch_id");

-- CreateIndex
CREATE INDEX "dispatch_records_dispatched_at_idx" ON "dispatch_records"("dispatched_at");

-- CreateIndex
CREATE INDEX "import_logs_uploaded_at_idx" ON "import_logs"("uploaded_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "alerts_resolved_idx" ON "alerts"("resolved");

-- CreateIndex
CREATE INDEX "alerts_batch_id_idx" ON "alerts"("batch_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "drugs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_imported_by_id_fkey" FOREIGN KEY ("imported_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch_records" ADD CONSTRAINT "dispatch_records_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispatch_records" ADD CONSTRAINT "dispatch_records_dispatched_by_id_fkey" FOREIGN KEY ("dispatched_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_logs" ADD CONSTRAINT "import_logs_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
