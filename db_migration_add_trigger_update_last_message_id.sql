-- Create a function to update last_message_id in conversation table when a new message is inserted
CREATE OR REPLACE FUNCTION update_last_message_id()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversation
    SET last_message_id = NEW.mess_id,
        updated_at = NOW()
    WHERE conversation_id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on message table after insert to call the function
CREATE TRIGGER trg_update_last_message_id
AFTER INSERT ON message
FOR EACH ROW
EXECUTE FUNCTION update_last_message_id();
