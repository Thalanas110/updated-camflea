-- Drop the existing CHECK constraint on the 'type' column
ALTER TABLE public.notifications DROP CONSTRAINT notifications_type_check;

-- Add a new CHECK constraint to allow 'message' and 'warning' types
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check CHECK (type IN ('message', 'warning'));
