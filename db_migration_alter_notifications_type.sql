-- Migration to alter notifications.type column to allow multiple types
ALTER TABLE notifications
DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications
ADD CONSTRAINT notifications_type_check CHECK (type IN ('message', 'item_sold', 'item_available', 'buy_request', 'cancel_trans', 'mark_sent', 'mark_received'));
