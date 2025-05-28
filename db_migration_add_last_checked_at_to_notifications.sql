-- Add last_checked_at column to notifications table with default current timestamp
ALTER TABLE notifications
ADD COLUMN last_checked_at TIMESTAMP DEFAULT now();

-- Optional: create an index on last_checked_at for faster queries if needed
CREATE INDEX idx_notifications_last_checked_at ON notifications(last_checked_at);
