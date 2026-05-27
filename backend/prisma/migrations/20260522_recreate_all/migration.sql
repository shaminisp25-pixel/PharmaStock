-- Migration: Recreate all tables and enums
-- Drops existing tables if present and recreates schema based on schema.prisma

BEGIN;

DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('admin','pharmacist','warehouse_staff','inspector');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "BatchStatus" AS ENUM ('active','dispatched','expired','quarantined');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "AlertType" AS ENUM ('near_expiry','expired','low_stock','temp_breach');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS import_logs CASCADE;
DROP TABLE IF EXISTS dispatch_records CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS drugs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
-- Ensure pgcrypto is enabled for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create warehouses
CREATE TABLE warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  temp_min double precision NOT NULL,
  temp_max double precision NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role "Role" NOT NULL,
  warehouse_id uuid NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT fk_users_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL
);
CREATE INDEX idx_users_email ON users(email);

-- Create drugs
CREATE TABLE drugs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  composition text,
  manufacturer text NOT NULL,
  category text,
  temp_min double precision NOT NULL,
  temp_max double precision NOT NULL,
  storage_notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX idx_drugs_name ON drugs(name);
CREATE INDEX idx_drugs_manufacturer ON drugs(manufacturer);

-- Create batches
CREATE TABLE batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_id uuid NOT NULL,
  batch_no text NOT NULL UNIQUE,
  expiry_date timestamptz NOT NULL,
  quantity integer NOT NULL,
  warehouse_id uuid NOT NULL,
  status "BatchStatus" DEFAULT 'active'::"BatchStatus" NOT NULL,
  imported_by_id uuid NULL,
  imported_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT fk_batches_drug FOREIGN KEY (drug_id) REFERENCES drugs(id) ON DELETE CASCADE,
  CONSTRAINT fk_batches_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  CONSTRAINT fk_batches_imported_by FOREIGN KEY (imported_by_id) REFERENCES users(id)
);
CREATE INDEX idx_batches_expiry_date ON batches(expiry_date);
CREATE INDEX idx_batches_status ON batches(status);
CREATE INDEX idx_batches_warehouse_id ON batches(warehouse_id);

-- Dispatch records
CREATE TABLE dispatch_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL,
  quantity_dispatched integer NOT NULL,
  destination text NOT NULL,
  prescription_ref text,
  dispatched_by_id uuid NOT NULL,
  dispatched_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT fk_dispatch_batch FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  CONSTRAINT fk_dispatch_user FOREIGN KEY (dispatched_by_id) REFERENCES users(id)
);
CREATE INDEX idx_dispatch_batch_id ON dispatch_records(batch_id);
CREATE INDEX idx_dispatch_dispatched_at ON dispatch_records(dispatched_at);

-- Import logs
CREATE TABLE import_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  total_rows integer NOT NULL,
  success_rows integer NOT NULL,
  failed_rows integer NOT NULL,
  errors jsonb DEFAULT '[]' NOT NULL,
  uploaded_by_id uuid NOT NULL,
  uploaded_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT fk_import_uploaded_by FOREIGN KEY (uploaded_by_id) REFERENCES users(id)
);
CREATE INDEX idx_import_uploaded_at ON import_logs(uploaded_at);

-- Audit logs
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  changes jsonb DEFAULT '{}'::jsonb,
  before_state jsonb,
  after_state jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);

-- Alerts
CREATE TABLE alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL,
  alert_type "AlertType" NOT NULL,
  resolved boolean DEFAULT false NOT NULL,
  resolved_at timestamptz,
  triggered_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT fk_alert_batch FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
);
CREATE INDEX idx_alerts_resolved ON alerts(resolved);
CREATE INDEX idx_alerts_batch_id ON alerts(batch_id);

COMMIT;

-- Notes:
-- This migration creates schema only. Use `node prisma/seed.ts` to populate test data.
-- To apply this migration run `psql "$DATABASE_URL" -f path/to/migration.sql` or use Prisma Migrate tooling.
