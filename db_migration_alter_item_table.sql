-- Migration to support price type and price range/hidden price in item table

-- Add new enum type for price type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_price_type_enum') THEN
        CREATE TYPE item_price_type_enum AS ENUM ('single', 'range', 'hidden');
    END IF;
END$$;

-- Add new columns for price type and price range
ALTER TABLE item
    ALTER COLUMN item_price DROP NOT NULL,
    ADD COLUMN IF NOT EXISTS item_price_type item_price_type_enum NOT NULL DEFAULT 'single',
    ADD COLUMN IF NOT EXISTS item_price_min NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS item_price_max NUMERIC(10,2);

-- Optional: You may want to drop old constraints or indexes on item_price if any
