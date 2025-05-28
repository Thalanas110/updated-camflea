const fetch = require('node-fetch');

const SUPABASE_URL = 'https://wuhgqjeijmxsgvnykttj.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1aGdxamVpam14c2d2bnlrdHRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjgyOTMwNCwiZXhwIjoyMDU4NDA1MzA0fQ.z25Bc1YxdBjWo5b9ezMW7noMSTehSNzTtzOCLFNm-o4'; // Replace with your actual key
const USER_EMAIL = '202312288@gordoncollege.edu.ph';

async function fetchAllUsers() {
  try {
    console.log('Fetching all users...');

    // Fetch all users
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'GET',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users. Status: ${response.status}`);
    }

    const data = await response.json();

    // Check if response structure is correct and log the response
    if (!data || !Array.isArray(data.users)) {
      throw new Error('Unexpected response structure: users field missing or not an array');
    }

    console.log('Response data:', data);

    const users = data.users || [];

    // Log the structure of a single user object to inspect the columns
    if (users.length > 0) {
      console.log('Sample user object structure:', JSON.stringify(users[0], null, 2));
    }

    // Proceed with actions on all users (or perform some other logic if needed)
    if (users.length === 0) {
      console.log('No users found.');
      return;
    }

    console.log('List of users and their roles/statuses:', users.map(user => ({
        email: user.email,
        role: user.role,
        emailConfirmedAt: user.email_confirmed_at
      })));
      

    // Now, let's delete a user that matches the target email (if found)
    const userToDelete = users.find(u => u.email === USER_EMAIL);

    if (!userToDelete) {
      console.error('❌ User not found');
      return;
    }

    console.log('User found:', userToDelete);

    // Check if user has an id before trying to delete
    if (!userToDelete.id) {
      console.error('❌ User ID is missing, cannot delete user');
      return;
    }

    // Delete the user
    const deleteResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (deleteResponse.ok) {
      console.log('✅ User deleted successfully');
    } else {
      const error = await deleteResponse.text();
      console.error('❌ Failed to delete user:', error);
    }
  } catch (error) {
    console.error('❌ An error occurred:', error.message);
  }
}

fetchAllUsers();
