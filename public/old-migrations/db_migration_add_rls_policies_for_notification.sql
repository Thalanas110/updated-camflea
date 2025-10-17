-- Enable Row Level Security on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select notifications where they are the receiver
CREATE POLICY "Allow logged-in user to select their notifications" ON public.notifications
FOR SELECT
USING (receiver_uuid = auth.uid());

-- Create policy to allow users to insert notifications where they are the sender or receiver
CREATE POLICY "Allow logged-in user to insert notifications they send or receive" ON public.notifications
FOR INSERT
WITH CHECK (sender_uuid = auth.uid() OR receiver_uuid = auth.uid());

-- Create policy to allow users to update notifications where they are the receiver
CREATE POLICY "Allow logged-in user to update their notifications" ON public.notifications
FOR UPDATE
USING (receiver_uuid = auth.uid());

-- Optionally, create policy to allow users to delete their notifications if needed
CREATE POLICY "Allow logged-in user to delete their notifications" ON public.notifications
FOR DELETE
USING (
  (sender_uuid = auth.uid()) OR (receiver_uuid = auth.uid())
);
