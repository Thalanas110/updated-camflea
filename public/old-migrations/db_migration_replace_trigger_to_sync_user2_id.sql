-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trg_sync_user2_id ON transactions;

-- Drop existing function if exists
DROP FUNCTION IF EXISTS sync_user2_id_with_buyer();

-- Recreate the trigger function with updated logic
CREATE OR REPLACE FUNCTION sync_user2_id_with_buyer()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user2_id in item table when a transaction is inserted or updated
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    UPDATE item
    SET user2_id = (
      SELECT buyer_uuid FROM transactions
      WHERE item_uuid = NEW.item_uuid AND status = 'requested'
      LIMIT 1
    )
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
