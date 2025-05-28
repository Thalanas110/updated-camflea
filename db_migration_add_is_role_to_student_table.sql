-- Migration to add is_role column to student table with default 0
ALTER TABLE student
ADD COLUMN IF NOT EXISTS is_role INTEGER NOT NULL DEFAULT 0;
