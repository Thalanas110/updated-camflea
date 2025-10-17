-- Step 1: Add new UUID columns for user1_id and user2_id
ALTER TABLE public.conversation
ADD COLUMN user1_uuid uuid,
ADD COLUMN user2_uuid uuid;

-- Step 2: Populate new UUID columns by joining with student table to get user UUIDs
UPDATE public.conversation c
SET user1_uuid = s1.user_id
FROM public.student s1
WHERE c.user1_id = s1.stud_id;

UPDATE public.conversation c
SET user2_uuid = s2.user_id
FROM public.student s2
WHERE c.user2_id = s2.stud_id;

-- Step 3: Drop old integer user1_id and user2_id columns
ALTER TABLE public.conversation
DROP COLUMN user1_id,
DROP COLUMN user2_id;

-- Step 4: Rename new UUID columns to user1_id and user2_id
ALTER TABLE public.conversation
RENAME COLUMN user1_uuid TO user1_id,
RENAME COLUMN user2_uuid TO user2_id;

-- Step 5: Enable Row Level Security and create policies
ALTER TABLE public.conversation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select own conversations" ON public.conversation
    FOR SELECT
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Insert own conversations" ON public.conversation
    FOR INSERT
    WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Update own conversations" ON public.conversation
    FOR UPDATE
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Delete own conversations" ON public.conversation
    FOR DELETE
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Note: Adjust the student table and column names as per your schema.
