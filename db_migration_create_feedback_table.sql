-- Migration to create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id SERIAL PRIMARY KEY,
    item_id UUID NOT NULL REFERENCES item(item_id) ON DELETE CASCADE,
    buyer_id INT NOT NULL REFERENCES student(stud_id) ON DELETE CASCADE,
    seller_id INT NOT NULL REFERENCES student(stud_id) ON DELETE CASCADE,
    stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_feedback_buyer_id ON feedback(buyer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_seller_id ON feedback(seller_id);
CREATE INDEX IF NOT EXISTS idx_feedback_item_id ON feedback(item_id);
