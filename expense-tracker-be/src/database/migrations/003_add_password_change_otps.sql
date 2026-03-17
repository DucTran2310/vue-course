-- Migration: Add password_change_otps table for OTP verification
-- Created: 2024-01-XX

-- Create password_change_otps table
CREATE TABLE IF NOT EXISTS password_change_otps (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    createduser VARCHAR(255) DEFAULT 'SYSTEM',
    updateduser VARCHAR(255) DEFAULT 'SYSTEM',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    isdeleted BOOLEAN DEFAULT FALSE,
    deleteddate TIMESTAMP WITH TIME ZONE,
    deleteduser VARCHAR(255)
);

-- Create index for faster OTP lookup
CREATE INDEX IF NOT EXISTS idx_password_change_otps_user_id ON password_change_otps(user_id);
CREATE INDEX IF NOT EXISTS idx_password_change_otps_otp ON password_change_otps(otp);
CREATE INDEX IF NOT EXISTS idx_password_change_otps_expires_at ON password_change_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_change_otps_is_used ON password_change_otps(is_used);

-- Add comment
COMMENT ON TABLE password_change_otps IS 'Stores OTP codes for password change verification';
COMMENT ON COLUMN password_change_otps.id IS 'Unique identifier for OTP record';
COMMENT ON COLUMN password_change_otps.user_id IS 'Reference to user requesting password change';
COMMENT ON COLUMN password_change_otps.otp IS '6-digit OTP code';
COMMENT ON COLUMN password_change_otps.expires_at IS 'OTP expiration timestamp (10 minutes from creation)';
COMMENT ON COLUMN password_change_otps.is_used IS 'Whether the OTP has been used';
COMMENT ON COLUMN password_change_otps.used_at IS 'Timestamp when OTP was used';