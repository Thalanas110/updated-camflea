-- Example PostgreSQL schema definition for transactions table
CREATE TABLE transactions (
    transac_id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL,
    buyer_uuid UUID NOT NULL,
    seller_id INTEGER NOT NULL,
    seller_uuid UUID NOT NULL,
    item_uuid UUID NOT NULL,
    status VARCHAR(20) NOT NULL, -- e.g., 'cart', 'requested', 'cancelled', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX idx_transactions_item_uuid ON transactions(item_uuid);

-- Foreign key constraints (assuming student table and item table exist)
ALTER TABLE transactions
ADD CONSTRAINT fk_buyer FOREIGN KEY (buyer_id) REFERENCES student(stud_id);

ALTER TABLE transactions
ADD CONSTRAINT fk_seller FOREIGN KEY (seller_id) REFERENCES student(stud_id);

ALTER TABLE transactions
ADD CONSTRAINT fk_item FOREIGN KEY (item_uuid) REFERENCES item(item_id);
