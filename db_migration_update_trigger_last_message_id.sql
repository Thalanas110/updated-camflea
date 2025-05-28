-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS trg_update_last_message_id ON message;
DROP FUNCTION IF EXISTS update_last_message_id();

-- Create or replace function to update last_message_id in conversation table
CREATE OR REPLACE FUNCTION update_last_message_id()
RETURNS TRIGGER AS $$
BEGIN
    -- Update last_message_id only if the new message is newer than the current last_message_id
    UPDATE conversation
    SET last_message_id = NEW.mess_id,
        updated_at = NOW()
    WHERE conversation_id = NEW.conversation_id
      AND (last_message_id IS NULL OR NEW.mess_created > (
          SELECT mess_created FROM message WHERE mess_id = last_message_id
      ));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on message table after INSERT or UPDATE to call the function
CREATE TRIGGER trg_update_last_message_id
AFTER INSERT OR UPDATE ON message
FOR EACH ROW
EXECUTE FUNCTION update_last_message_id();
