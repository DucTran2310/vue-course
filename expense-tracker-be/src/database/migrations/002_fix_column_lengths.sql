-- Migration to fix column length issues

-- Fix users table - increase full_name length (already VARCHAR(255), no need to change)
-- The issue is with audit fields (createduser, updateduser, deleteduser) being VARCHAR(20)

-- Increase audit fields length in users table
ALTER TABLE users 
  ALTER COLUMN createduser TYPE VARCHAR(100),
  ALTER COLUMN updateduser TYPE VARCHAR(100),
  ALTER COLUMN deleteduser TYPE VARCHAR(100);

-- Increase audit fields length in settings table
ALTER TABLE settings 
  ALTER COLUMN createduser TYPE VARCHAR(100),
  ALTER COLUMN updateduser TYPE VARCHAR(100),
  ALTER COLUMN deleteduser TYPE VARCHAR(100);

-- Increase audit fields length in categories table
ALTER TABLE categories 
  ALTER COLUMN createduser TYPE VARCHAR(100),
  ALTER COLUMN updateduser TYPE VARCHAR(100),
  ALTER COLUMN deleteduser TYPE VARCHAR(100);

-- Increase audit fields length in transactions table
ALTER TABLE transactions 
  ALTER COLUMN createduser TYPE VARCHAR(100),
  ALTER COLUMN updateduser TYPE VARCHAR(100),
  ALTER COLUMN deleteduser TYPE VARCHAR(100);

-- Increase audit fields length in budgets table
ALTER TABLE budgets 
  ALTER COLUMN createduser TYPE VARCHAR(100),
  ALTER COLUMN updateduser TYPE VARCHAR(100),
  ALTER COLUMN deleteduser TYPE VARCHAR(100);

-- Increase audit fields length in recurring_transactions table
ALTER TABLE recurring_transactions 
  ALTER COLUMN createduser TYPE VARCHAR(100),
  ALTER COLUMN updateduser TYPE VARCHAR(100),
  ALTER COLUMN deleteduser TYPE VARCHAR(100);

-- Increase audit fields length in email_verification_tokens table
ALTER TABLE email_verification_tokens 
  ALTER COLUMN createduser TYPE VARCHAR(100),
  ALTER COLUMN updateduser TYPE VARCHAR(100),
  ALTER COLUMN deleteduser TYPE VARCHAR(100);

COMMENT ON TEXT 'Migration to fix VARCHAR(20) limit on audit fields';