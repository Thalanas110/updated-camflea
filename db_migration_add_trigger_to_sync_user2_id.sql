-- Create a trigger function to sync user2_id in item table with buyer_id from transactions table
-- If there is a current buyer for the item, user2_id is set to that buyer's UUID
-- If no current buyer, user2_id is set to NULL

CREATE OR REPLACE FUNCTION sync_user2_id_with_buyer()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user2_id in item table when a transaction is inserted or updated
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    UPDATE item
    SET user2_id = NEW.buyer_uuid
    WHERE item_id = NEW.item_uuid;
  ELSIF (TG_OP = 'DELETE') THEN
    -- On transaction delete, check if other requested transactions exist for the item
    IF NOT EXISTS (
      SELECT 1 FROM transactions
      WHERE item_uuid = OLD.item_uuid AND status = 'requested'
    ) THEN
      UPDATE item
      SET user2_id = NULL
      WHERE item_id = OLD.item_uuid;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on transactions table for INSERT, UPDATE, DELETE
CREATE TRIGGER trg_sync_user2_id
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION sync_user2_id_with_buyer();
