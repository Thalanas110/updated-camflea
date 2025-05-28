-- Add user2_id column to item table to store buyer UUID
-- This column can be NULL if there is no current buyer

ALTER TABLE item
ADD COLUMN user2_id uuid NULL;

-- No foreign key constraint added due to buyer_id in transactions not being unique
-- user2_id should be populated and maintained via application logic or triggers
