-- Enable Row Level Security on transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow buyer or seller to access transactions" ON public.transactions;

-- Create RLS policy to allow access if buyer_uuid or seller_uuid matches auth.uid()
CREATE POLICY "Allow buyer or seller to access transactions" ON public.transactions
    FOR ALL
    USING (
        buyer_uuid = auth.uid() OR
        seller_uuid = auth.uid()
    );
