import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wuhgqjeijmxsgvnykttj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1aGdxamVpam14c2d2bnlrdHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MjkzMDQsImV4cCI6MjA1ODQwNTMwNH0._lZy7CE2A8HM1hatjGYrMR8QAUi8nk4L_EuV7Fojhwg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  try {
    const testMessage = {
      sender_id: 1,
      receiver_id: 2,
      sender_uid: 'test-sender-uid',
      receiver_uid: 'test-receiver-uid',
      mess_content: 'Test message from test_supabase_insert.js',
      mess_photo: null,
    };

    const { data, error } = await supabase
      .from('message')
      .insert(testMessage)
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log('Insert success:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testInsert();
