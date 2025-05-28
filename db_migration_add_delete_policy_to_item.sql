-- Add DELETE policy for authenticated users on item table
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON "public"."item";

CREATE POLICY "Allow delete for authenticated users"
ON "public"."item"
AS PERMISSIVE
FOR DELETE
TO public
USING (
  auth.role() = 'authenticated'::text
  AND user_id = auth.uid()
);
