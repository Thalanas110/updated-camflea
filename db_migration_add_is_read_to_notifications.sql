-- Add is_read column to notifications table with default false (unread)
ALTER TABLE notifications
ADD COLUMN is_read BOOLEAN DEFAULT FALSE;

-- Optional: create an index on is_read for faster queries if needed
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
