import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qbsrmbxuwacpqquorqaq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

// Create Supabase admin client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const DEFAULT_PASSWORD = 'Welcome2025!';

async function updateUserPasswords() {
  console.log('📊 Fetching all users...');
  
  // Get all users from public.users table
  const { data: users, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('id, email, name');
  
  if (fetchError) {
    console.error('❌ Error fetching users:', fetchError.message);
    process.exit(1);
  }
  
  if (!users || users.length === 0) {
    console.log('ℹ️  No users found to update.');
    return;
  }
  
  console.log(`✅ Found ${users.length} users\n`);
  
  const results = {
    success: 0,
    errors: 0,
    errorsList: []
  };
  
  // Update each user's password
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    
    try {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          password: DEFAULT_PASSWORD,
          user_metadata: {
            ...(user.name ? { name: user.name } : {}),
            default_password: true
          }
        }
      );
      
      if (error) {
        throw error;
      }
      
      console.log(`✅ [${i + 1}/${users.length}] Updated password for: ${user.email}`);
      results.success++;
    } catch (error) {
      console.error(`❌ [${i + 1}/${users.length}] Error updating ${user.email}:`, error.message);
      results.errors++;
      results.errorsList.push({ email: user.email, error: error.message });
    }
    
    // Small delay to avoid rate limiting
    if (i < users.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Update Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successfully updated: ${results.success} users`);
  console.log(`❌ Errors: ${results.errors} users`);
  console.log('='.repeat(50));
  console.log(`\n💡 All users can now sign in with password: ${DEFAULT_PASSWORD}`);
  console.log('   They can also use the "Email Link" option for passwordless sign-in.');
  
  if (results.errorsList.length > 0) {
    console.log('\n❌ Errors:');
    results.errorsList.forEach(({ email, error }) => {
      console.log(`   - ${email}: ${error}`);
    });
  }
}

updateUserPasswords().catch(console.error);
