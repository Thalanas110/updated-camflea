-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to item table
ALTER TABLE item
ADD COLUMN IF NOT EXISTS embedding vector(1536);
