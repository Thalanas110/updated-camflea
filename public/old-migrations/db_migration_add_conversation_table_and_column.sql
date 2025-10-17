-- Create conversation table if it does not exist
CREATE TABLE IF NOT EXISTS conversation (
    conversation_id SERIAL PRIMARY KEY,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    context TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add conversation_id column to message table if not exists
ALTER TABLE message
ADD COLUMN IF NOT EXISTS conversation_id INTEGER;

-- Note: Data migration script needed to:
-- 1. Identify unique user pairs from messages (sender and receiver).
-- 2. Create conversation records for each unique pair.
-- 3. Update messages to set conversation_id based on sender and receiver pair.
-- 4. After data migration, add foreign key and NOT NULL constraints on message.conversation_id.
