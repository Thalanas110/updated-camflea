-- Add last_checked_at column to student table to track when user last checked notifications
ALTER TABLE student
ADD COLUMN last_checked_at TIMESTAMP DEFAULT NOW();

-- Optional: create an index on last_checked_at for faster queries if needed
CREATE INDEX idx_student_last_checked_at ON student(last_checked_at);
