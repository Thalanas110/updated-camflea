CREATE TABLE notifications (  
  notif_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

  sender_id INTEGER REFERENCES student(stud_id) ON DELETE SET NULL, 
  receiver_id INTEGER REFERENCES student(stud_id) ON DELETE CASCADE, 
  
  type TEXT NOT NULL CHECK (type = 'message'), -- For now, only 'message'
  content TEXT, -- Short description
  metadata JSONB, -- Optional: structured extra info
  is_read BOOLEAN DEFAULT false, -- Unread by default
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Timestamp of creation
);
