-- Drop existing RLS policies on notifications table
DROP POLICY IF EXISTS "Allow logged-in user to select their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow logged-in user to insert notifications they send or receive" ON public.notifications;
DROP POLICY IF EXISTS "Allow logged-in user to update their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow logged-in user to delete their notifications" ON public.notifications;

-- Re-enable Row Level Security (if it was disabled, though it should be enabled)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy for service_role to bypass RLS (for admin actions)
CREATE POLICY "Service role full access" ON public.notifications
FOR ALL
TO service_role
USING (true) WITH CHECK (true);

-- Create policy to allow users to select notifications where they are the receiver
CREATE POLICY "Allow logged-in user to select their notifications by id" ON public.notifications
FOR SELECT
USING (receiver_id = (SELECT stud_id FROM public.student WHERE auth_uuid = auth.uid()));

-- Create policy to allow users to insert notifications where they are the sender or receiver
CREATE POLICY "Allow logged-in user to insert notifications they send or receive by id" ON public.notifications
FOR INSERT
WITH CHECK (
    sender_id = (SELECT stud_id FROM public.student WHERE auth_uuid = auth.uid())
    OR receiver_id = (SELECT stud_id FROM public.student WHERE auth_uuid = auth.uid())
);

-- Create policy to allow users to update notifications where they are the receiver
CREATE POLICY "Allow logged-in user to update their notifications by id" ON public.notifications
FOR UPDATE
USING (receiver_id = (SELECT stud_id FROM public.student WHERE auth_uuid = auth.uid()));

-- Optionally, create policy to allow users to delete their notifications if needed
CREATE POLICY "Allow logged-in user to delete their notifications by id" ON public.notifications
FOR DELETE
USING (
  (sender_id = (SELECT stud_id FROM public.student WHERE auth_uuid = auth.uid()))
  OR (receiver_id = (SELECT stud_id FROM public.student WHERE auth_uuid = auth.uid()))
);
