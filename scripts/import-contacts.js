import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parse } from 'csv-parse/sync';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qbsrmbxuwacpqquorqaq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('   Please set it before running this script:');
  console.error('   export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

// Create Supabase admin client (with service role key for admin operations)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Generate a secure random password
function generatePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Parse CSV and create users
async function importContacts() {
  const csvPath = process.argv[2] || 'C:\\Users\\jenni\\Downloads\\site_2147540980_contacts_d082236a-ec76-4857-aae5-097a32e2a0ce_complete.csv';
  
  console.log('📖 Reading CSV file...');
  const csvContent = readFileSync(csvPath, 'utf-8');
  
  console.log('📊 Parsing CSV...');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true
  });
  
  console.log(`✅ Found ${records.length} contacts in CSV\n`);
  
  const results = {
    success: 0,
    skipped: 0,
    errors: 0,
    errorsList: []
  };
  
  // Process each contact
  for (let i = 0; i < records.length; i++) {
    const contact = records[i];
    const email = contact.Email || contact['Email (email)'];
    const firstName = contact['First Name'] || contact['Name (name)']?.split(' ')[0] || '';
    const lastName = contact['Last Name'] || contact['Name (name)']?.split(' ').slice(1).join(' ') || '';
    const fullName = contact.Name || contact['Name (name)'] || `${firstName} ${lastName}`.trim() || email?.split('@')[0] || 'User';
    
    // Skip if no email
    if (!email || !email.includes('@')) {
      console.log(`⏭️  [${i + 1}/${records.length}] Skipping: No valid email (${fullName})`);
      results.skipped++;
      continue;
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    if (existingUser?.user) {
      console.log(`⏭️  [${i + 1}/${records.length}] Skipping: User already exists (${email})`);
      results.skipped++;
      continue;
    }
    
    // Generate temporary password
    const tempPassword = generatePassword();
    
    try {
      // Create user in Supabase Auth
      const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name: fullName,
          first_name: firstName,
          last_name: lastName,
          imported_from_csv: true,
          imported_at: new Date().toISOString()
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (newUser?.user) {
        console.log(`✅ [${i + 1}/${records.length}] Created user: ${email} (${fullName})`);
        results.success++;
        
        // The trigger should automatically create entry in public.users
        // But let's verify it exists
        const { data: publicUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('id', newUser.user.id)
          .single();
        
        if (!publicUser) {
          // If trigger didn't fire, create it manually
          await supabaseAdmin
            .from('users')
            .insert({
              id: newUser.user.id,
              email: email,
              name: fullName
            });
        }
      }
    } catch (error) {
      console.error(`❌ [${i + 1}/${records.length}] Error creating user ${email}:`, error.message);
      results.errors++;
      results.errorsList.push({ email, error: error.message });
    }
    
    // Add small delay to avoid rate limiting
    if (i < records.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successfully created: ${results.success} users`);
  console.log(`⏭️  Skipped: ${results.skipped} contacts`);
  console.log(`❌ Errors: ${results.errors} contacts`);
  console.log('='.repeat(50));
  
  if (results.errorsList.length > 0) {
    console.log('\n❌ Errors:');
    results.errorsList.forEach(({ email, error }) => {
      console.log(`   - ${email}: ${error}`);
    });
  }
  
  console.log('\n💡 Note: Users have been created with temporary passwords.');
  console.log('   They will need to use "Forgot Password" to set their own password.');
}

// Run the import
importContacts().catch(console.error);
