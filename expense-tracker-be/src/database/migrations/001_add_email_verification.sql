-- Email Verification Tokens Table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createduser VARCHAR(255) DEFAULT 'SYSTEM',
  updateduser VARCHAR(255),
  isdeleted BOOLEAN DEFAULT FALSE,
  deleteduser VARCHAR(255),
  deleteddate TIMESTAMP,
  deletednote VARCHAR(255),
  cdc_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cdc_version INTEGER DEFAULT 1,
  
  CONSTRAINT fk_email_verification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_email_verification_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_verification_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_email ON email_verification_tokens(email);
CREATE INDEX IF NOT EXISTS idx_email_verification_expires_at ON email_verification_tokens(expires_at);

-- Add email_verified column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

-- Create trigger for updated_at on email_verification_tokens
CREATE OR REPLACE FUNCTION update_email_verification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_email_verification_updated_at
  BEFORE UPDATE ON email_verification_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_email_verification_updated_at();