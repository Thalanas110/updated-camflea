-- Add foreign key constraint for user2_id in item table referencing auth.users.id
-- user2_id should only be populated by the buyer_uuid of the transactions table

ALTER TABLE item
ADD CONSTRAINT fk_user2_id_auth_users
FOREIGN KEY (user2_id) REFERENCES auth.users(id)
ON DELETE SET NULL;
