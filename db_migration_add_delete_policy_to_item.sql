-- Add DELETE policy for authenticated users on item table
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON "public"."item";

CREATE POLICY "Allow delete for authenticated users"
ON "public"."item"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.student WHERE stud_id = auth.uid() AND is_role = 1) OR (user_id = auth.uid()));
