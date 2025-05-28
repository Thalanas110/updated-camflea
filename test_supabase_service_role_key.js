import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function testServiceRoleKey() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Try to fetch one item from the item table
    const { data, error } = await supabase
      .from('item')
      .select('item_id')
      .limit(1);

    if (error) {
      console.error('Error querying item table with service role key:', error);
      process.exit(1);
    }

    console.log('Successfully queried item table with service role key. Sample data:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

testServiceRoleKey();
