-- Database schema for Expense Tracker with Audit & CDC fields

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HELPER FUNCTION: Add audit fields to table
-- ============================================
CREATE OR REPLACE FUNCTION add_audit_fields(table_name TEXT)
RETURNS VOID AS $$
BEGIN
    -- createduser
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS createduser VARCHAR(20) NOT NULL DEFAULT ''SYSTEM''', table_name);
    -- createddate
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS createddate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP', table_name);
    -- updateduser
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS updateduser VARCHAR(20)', table_name);
    -- updateddate
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS updateddate TIMESTAMP', table_name);
    -- isdeleted
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS isdeleted BOOLEAN NOT NULL DEFAULT FALSE', table_name);
    -- deleteduser
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS deleteduser VARCHAR(20)', table_name);
    -- deleteddate
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS deleteddate TIMESTAMP', table_name);
    -- deletednote
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS deletednote VARCHAR(500)', table_name);
    -- cdc_timestamp
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS cdc_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP', table_name);
    -- cdc_version
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS cdc_version INTEGER NOT NULL DEFAULT 1', table_name);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Users table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
SELECT add_audit_fields('users');

-- ============================================
-- Settings table
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(10) DEFAULT 'VND',
    language VARCHAR(10) DEFAULT 'vi',
    theme VARCHAR(20) DEFAULT 'light',
    default_category_expense INTEGER,
    default_category_income INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);
SELECT add_audit_fields('settings');

-- ============================================
-- Categories table
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
SELECT add_audit_fields('categories');

-- ============================================
-- Transactions table
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
SELECT add_audit_fields('transactions');

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_isdeleted ON transactions(isdeleted) WHERE isdeleted = TRUE;

-- ============================================
-- Budgets table
-- ============================================
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    amount DECIMAL(15, 2) NOT NULL,
    spent_amount DECIMAL(15, 2) DEFAULT 0,
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly')),
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
SELECT add_audit_fields('budgets');

-- Indexes for budgets
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_isdeleted ON budgets(isdeleted) WHERE isdeleted = TRUE;

-- ============================================
-- Recurring transactions table
-- ============================================
CREATE TABLE IF NOT EXISTS recurring_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    recurrence VARCHAR(20) NOT NULL CHECK (recurrence IN ('daily', 'weekly', 'monthly', 'yearly')),
    next_due_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
SELECT add_audit_fields('recurring_transactions');

-- Indexes for recurring transactions
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_user_id ON recurring_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_category_id ON recurring_transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_is_active ON recurring_transactions(is_active);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_isdeleted ON recurring_transactions(isdeleted) WHERE isdeleted = TRUE;

-- ============================================
-- Function to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.updateddate = CURRENT_TIMESTAMP;
    NEW.updateduser = COALESCE(NEW.updateduser, OLD.updateduser, 'SYSTEM');
    NEW.cdc_timestamp = CURRENT_TIMESTAMP;
    NEW.cdc_version = COALESCE(OLD.cdc_version, 0) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_transactions_updated_at BEFORE UPDATE ON recurring_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Function for soft delete (sets isdeleted = TRUE)
-- ============================================
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    NEW.isdeleted = TRUE;
    NEW.deleteddate = CURRENT_TIMESTAMP;
    NEW.deleteduser = COALESCE(NEW.deleteduser, 'SYSTEM');
    NEW.cdc_timestamp = CURRENT_TIMESTAMP;
    NEW.cdc_version = COALESCE(OLD.cdc_version, 0) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Helper function to add soft delete trigger to table
-- ============================================
CREATE OR REPLACE FUNCTION add_soft_delete_trigger(table_name TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('CREATE TRIGGER soft_delete_%I BEFORE DELETE ON %I FOR EACH ROW EXECUTE FUNCTION soft_delete()', table_name, table_name);
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Trigger for table % already exists or error occurred', table_name;
END;
$$ LANGUAGE plpgsql;

-- Add soft delete triggers to all tables
SELECT add_soft_delete_trigger('users');
SELECT add_soft_delete_trigger('settings');
SELECT add_soft_delete_trigger('categories');
SELECT add_soft_delete_trigger('transactions');
SELECT add_soft_delete_trigger('budgets');
SELECT add_soft_delete_trigger('recurring_transactions');

-- ============================================
-- Helper function to create view for non-deleted records
-- ============================================
CREATE OR REPLACE FUNCTION create_active_view(table_name TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('CREATE OR REPLACE VIEW %I_active AS SELECT * FROM %I WHERE isdeleted = FALSE', table_name, table_name);
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating view for table %', table_name;
END;
$$ LANGUAGE plpgsql;

-- Create views for active (non-deleted) records
SELECT create_active_view('users');
SELECT create_active_view('settings');
SELECT create_active_view('categories');
SELECT create_active_view('transactions');
SELECT create_active_view('budgets');
SELECT create_active_view('recurring_transactions');

-- Drop helper functions after use (optional - keep if you want to add more tables later)
-- DROP FUNCTION IF EXISTS add_audit_fields(TEXT);
-- DROP FUNCTION IF EXISTS add_soft_delete_trigger(TEXT);
-- DROP FUNCTION IF EXISTS create_active_view(TEXT);