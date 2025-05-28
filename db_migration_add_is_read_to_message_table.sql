-- Migration to add is_read column to message table
ALTER TABLE message
ADD COLUMN is_read BOOLEAN DEFAULT FALSE;
