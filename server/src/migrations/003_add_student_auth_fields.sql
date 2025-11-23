-- Migration: Add student authentication fields and make email optional
-- Production-ready migration with proper constraints and indexes

BEGIN;

-- Add new columns to students table
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS pincode VARCHAR(6),
  ADD COLUMN IF NOT EXISTS program_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS batch INTEGER,
  ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS password_reset_required BOOLEAN DEFAULT TRUE;

-- Make email optional (nullable)
ALTER TABLE students ALTER COLUMN email DROP NOT NULL;

-- Add indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_students_batch ON students(batch);
CREATE INDEX IF NOT EXISTS idx_students_program ON students(program_name);
CREATE INDEX IF NOT EXISTS idx_students_pincode ON students(pincode);
CREATE INDEX IF NOT EXISTS idx_students_dob ON students(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_students_first_login ON students(is_first_login) WHERE is_first_login = TRUE;

-- Add constraints for data integrity
ALTER TABLE students
  ADD CONSTRAINT IF NOT EXISTS chk_batch_year CHECK (batch >= 2000 AND batch <= 2035),
  ADD CONSTRAINT IF NOT EXISTS chk_pincode_format CHECK (pincode ~ '^[0-9]{6}$');

-- Add comments for documentation
COMMENT ON COLUMN students.date_of_birth IS 'Student date of birth - used for password reset verification (PII - handle with care)';
COMMENT ON COLUMN students.pincode IS 'Student address pincode (6 digits) - used for password reset verification';
COMMENT ON COLUMN students.address IS 'Student full address (optional)';
COMMENT ON COLUMN students.program_name IS 'Academic program (e.g., BTech CSE, MBA, MCA)';
COMMENT ON COLUMN students.batch IS 'Enrollment year (e.g., 2022, 2023)';
COMMENT ON COLUMN students.is_first_login IS 'TRUE if student has never changed default password';
COMMENT ON COLUMN students.password_reset_required IS 'TRUE if student must reset password on next login';

COMMIT;

-- Verification query
-- SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'students' ORDER BY ordinal_position;
