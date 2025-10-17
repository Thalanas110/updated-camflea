DROP POLICY IF EXISTS "Select own conversations" ON public.conversation;
DROP POLICY IF EXISTS "Insert own conversations" ON public.conversation;
DROP POLICY IF EXISTS "Update own conversations" ON public.conversation;
DROP POLICY IF EXISTS "Delete own conversations" ON public.conversation;
-- Enable Row Level Security on conversation table
ALTER TABLE public.conversation ENABLE ROW LEVEL SECURITY;

-- Adjusted policy to use user UUIDs instead of stud_id for better alignment with JWT claims
CREATE POLICY "Select own conversations" ON public.conversation
    FOR SELECT
    USING (
        user1_uuid = current_setting('request.jwt.claims.user_id', true)::uuid
        OR user2_uuid = current_setting('request.jwt.claims.user_id', true)::uuid
    );

CREATE POLICY "Insert own conversations" ON public.conversation
    FOR INSERT
    WITH CHECK (
        user1_uuid = current_setting('request.jwt.claims.user_id', true)::uuid
        OR user2_uuid = current_setting('request.jwt.claims.user_id', true)::uuid
    );

CREATE POLICY "Update own conversations" ON public.conversation
    FOR UPDATE
    USING (
        user1_uuid = current_setting('request.jwt.claims.user_id', true)::uuid
        OR user2_uuid = current_setting('request.jwt.claims.user_id', true)::uuid
    );

CREATE POLICY "Delete own conversations" ON public.conversation
    FOR DELETE
    USING (
        user1_uuid = current_setting('request.jwt.claims.user_id', true)::uuid
        OR user2_uuid = current_setting('request.jwt.claims.user_id', true)::uuid
    );

-- Note: This requires that your JWT token includes 'user_id' as a custom claim (the UUID of the user).
-- Adjust your authentication setup accordingly.
-- Also create similar policies for the message table to secure messages.
