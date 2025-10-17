-- Drop existing update policy if exists
DROP POLICY IF EXISTS "Allow update for authenticated users" ON "public"."item";

-- Create updated update policy with correct syntax
CREATE POLICY "Allow update for authenticated users"
ON "public"."item"
AS PERMISSIVE
FOR UPDATE
TO public
USING (
  auth.role() = 'authenticated'::text
  AND user_id = auth.uid()
)
WITH CHECK (
  auth.role() = 'authenticated'::text
  AND user_id = auth.uid()
);

-- Ensure insert policy exists with ownership check
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON "public"."item";

CREATE POLICY "Allow insert for authenticated users"
ON "public"."item"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (
  auth.role() = 'authenticated'::text
  AND user_id = auth.uid()
);

-- Ensure select policy allows all authenticated users to see all items
DROP POLICY IF EXISTS "Allow select for all authenticated users" ON "public"."item";

CREATE POLICY "Allow select for all authenticated users"
ON "public"."item"
AS PERMISSIVE
FOR SELECT
TO public
USING (
  auth.role() = 'authenticated'::text
);
