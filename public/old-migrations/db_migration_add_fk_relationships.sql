-- Add foreign key constraints for user1_uuid and user2_uuid in conversation table referencing student table

ALTER TABLE public.conversation
ADD CONSTRAINT conversation_user1_uuid_fkey FOREIGN KEY (user1_uuid)
REFERENCES public.student(user_id)
ON DELETE CASCADE;

ALTER TABLE public.conversation
ADD CONSTRAINT conversation_user2_uuid_fkey FOREIGN KEY (user2_uuid)
REFERENCES public.student(user_id)
ON DELETE CASCADE;
