/*
  Warnings:

  - The primary key for the `alerts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `audit_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `batches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `dispatch_records` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `drugs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `import_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `warehouses` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "alerts" DROP CONSTRAINT "fk_alert_batch";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "fk_audit_user";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "fk_batches_drug";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "fk_batches_imported_by";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "fk_batches_warehouse";

-- DropForeignKey
ALTER TABLE "dispatch_records" DROP CONSTRAINT "fk_dispatch_batch";

-- DropForeignKey
ALTER TABLE "dispatch_records" DROP CONSTRAINT "fk_dispatch_user";

-- DropForeignKey
ALTER TABLE "import_logs" DROP CONSTRAINT "fk_import_uploaded_by";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "fk_users_warehouse";

-- AlterTable
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "batch_id" SET DATA TYPE TEXT,
ALTER COLUMN "resolved_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "triggered_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "alerts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "batches" DROP CONSTRAINT "batches_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "drug_id" SET DATA TYPE TEXT,
ALTER COLUMN "expiry_date" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "warehouse_id" SET DATA TYPE TEXT,
ALTER COLUMN "imported_by_id" SET DATA TYPE TEXT,
ALTER COLUMN "imported_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "batches_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dispatch_records" DROP CONSTRAINT "dispatch_records_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "batch_id" SET DATA TYPE TEXT,
ALTER COLUMN "dispatched_by_id" SET DATA TYPE TEXT,
ALTER COLUMN "dispatched_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "dispatch_records_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "drugs" DROP CONSTRAINT "drugs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "drugs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "import_logs" DROP CONSTRAINT "import_logs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "uploaded_by_id" SET DATA TYPE TEXT,
ALTER COLUMN "uploaded_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "import_logs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "warehouse_id" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id");

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

-- RenameIndex
ALTER INDEX "idx_alerts_batch_id" RENAME TO "alerts_batch_id_idx";

-- RenameIndex
ALTER INDEX "idx_alerts_resolved" RENAME TO "alerts_resolved_idx";

-- RenameIndex
ALTER INDEX "idx_audit_entity" RENAME TO "audit_logs_entity_type_entity_id_idx";

-- RenameIndex
ALTER INDEX "idx_audit_user" RENAME TO "audit_logs_user_id_idx";

-- RenameIndex
ALTER INDEX "idx_batches_expiry_date" RENAME TO "batches_expiry_date_idx";

-- RenameIndex
ALTER INDEX "idx_batches_status" RENAME TO "batches_status_idx";

-- RenameIndex
ALTER INDEX "idx_batches_warehouse_id" RENAME TO "batches_warehouse_id_idx";

-- RenameIndex
ALTER INDEX "idx_dispatch_batch_id" RENAME TO "dispatch_records_batch_id_idx";

-- RenameIndex
ALTER INDEX "idx_dispatch_dispatched_at" RENAME TO "dispatch_records_dispatched_at_idx";

-- RenameIndex
ALTER INDEX "idx_drugs_manufacturer" RENAME TO "drugs_manufacturer_idx";

-- RenameIndex
ALTER INDEX "idx_drugs_name" RENAME TO "drugs_name_idx";

-- RenameIndex
ALTER INDEX "idx_import_uploaded_at" RENAME TO "import_logs_uploaded_at_idx";

-- RenameIndex
ALTER INDEX "idx_users_email" RENAME TO "users_email_idx";
