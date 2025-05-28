-- Migration to create "report" table for user reports

CREATE TABLE IF NOT EXISTS report (
    report_id SERIAL PRIMARY KEY,
    reported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    violation_type TEXT NOT NULL,
    violation_details TEXT,
    photo_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optional: Add index on reported_user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_report_reported_user_id ON report (reported_user_id);
