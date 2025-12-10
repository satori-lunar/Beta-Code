# Birch and Stone User Dashboard

A Supabase-powered user dashboard with authentication, profiles, and activity tracking.

## 🚀 Project Information

- **Project Name:** birch and stone user dashboard
- **Project ID:** qbsrmbxuwacpqquorqaq
- **Region:** us-east-1
- **API URL:** https://qbsrmbxuwacpqquorqaq.supabase.co
- **Database:** PostgreSQL 17.6.1

## 📦 Database Schema

### Tables Created

#### 1. **user_profiles**
Stores user profile information linked to Supabase Auth users.
- `id` - UUID (references auth.users)
- `email` - Text
- `full_name` - Text
- `avatar_url` - Text
- `bio` - Text
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### 2. **dashboard_settings**
Stores user dashboard preferences and settings.
- `id` - UUID
- `user_id` - UUID (references auth.users)
- `theme` - Text ('light', 'dark', 'auto')
- `language` - Text (default: 'en')
- `notifications_enabled` - Boolean
- `email_notifications` - Boolean
- `settings_json` - JSONB (for additional custom settings)
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### 3. **activity_log**
Tracks user activities within the dashboard.
- `id` - UUID
- `user_id` - UUID (references auth.users)
- `action` - Text
- `description` - Text
- `metadata` - JSONB
- `ip_address` - Text
- `user_agent` - Text
- `created_at` - Timestamp

### Security

✅ **Row Level Security (RLS)** is enabled on all tables
✅ **Policies** ensure users can only access their own data
✅ **Security advisories** have been addressed

## 🔑 API Keys

### Publishable Key (Recommended)
```
sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3
```

### Legacy Anon Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFic3JtYnh1d2FjcHFxdW9ycWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDAxMTQsImV4cCI6MjA4MDkxNjExNH0.FwYzofr_mHmVgGU9fwldOqpwomftzVjS2Yapg-P_XqA
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
# or
pnpm add @supabase/supabase-js
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qbsrmbxuwacpqquorqaq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3
```

### 3. Use the Supabase Client

The project includes:
- `supabase-types.ts` - TypeScript types for your database
- `supabase-client.ts` - Pre-configured Supabase client with helper functions

## 📖 Usage Examples

### Authentication

```typescript
import { supabase } from './supabase-client'

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

### User Profile Management

```typescript
import { getUserProfile, updateUserProfile } from './supabase-client'

// Get profile
const { data: profile } = await getUserProfile(userId)

// Update profile
await updateUserProfile(userId, {
  full_name: 'John Doe',
  bio: 'Software developer',
  avatar_url: 'https://example.com/avatar.jpg'
})
```

### Dashboard Settings

```typescript
import { getDashboardSettings, updateDashboardSettings } from './supabase-client'

// Get settings
const { data: settings } = await getDashboardSettings(userId)

// Update settings
await updateDashboardSettings(userId, {
  theme: 'dark',
  notifications_enabled: true,
  language: 'en'
})
```

### Activity Logging

```typescript
import { logActivity, getActivityLog } from './supabase-client'

// Log an activity
await logActivity(userId, 'profile_updated', 'User updated their profile picture', {
  field: 'avatar_url',
  previous_value: null
})

// Get activity log
const { data: activities } = await getActivityLog(userId, 20)
```

## 🎨 React Component Examples

### User Profile Component

```typescript
import { useEffect, useState } from 'react'
import { getUserProfile, updateUserProfile } from './supabase-client'
import { supabase } from './supabase-client'

export function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await getUserProfile(user.id)
        setProfile(data)
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>{profile?.full_name || 'Anonymous'}</h1>
      <p>{profile?.bio}</p>
      {profile?.avatar_url && <img src={profile.avatar_url} alt="Avatar" />}
    </div>
  )
}
```

### Dashboard Settings Component

```typescript
import { useEffect, useState } from 'react'
import { getDashboardSettings, updateDashboardSettings } from './supabase-client'
import { supabase } from './supabase-client'

export function DashboardSettings() {
  const [settings, setSettings] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data } = await getDashboardSettings(user.id)
        setSettings(data)
      }
    }
    loadSettings()
  }, [])

  const handleThemeChange = async (theme: 'light' | 'dark' | 'auto') => {
    if (userId) {
      await updateDashboardSettings(userId, { theme })
      setSettings({ ...settings, theme })
    }
  }

  return (
    <div>
      <h2>Settings</h2>
      <select 
        value={settings?.theme || 'light'} 
        onChange={(e) => handleThemeChange(e.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="auto">Auto</option>
      </select>
    </div>
  )
}
```

## 🔐 Security Notes

- All tables have Row Level Security (RLS) enabled
- Users can only read/write their own data
- The `handle_updated_at` function has been secured with proper search_path settings
- Use environment variables to store API keys securely
- Never commit API keys to version control

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Linter](https://supabase.com/docs/guides/database/database-linter)

## 🎯 Next Steps

1. Set up authentication UI (sign up, login, password reset)
2. Create user dashboard pages
3. Implement real-time subscriptions for activity updates
4. Add file upload for user avatars (using Supabase Storage)
5. Deploy your application
6. Configure custom domain and email templates

## 💡 Tips

- Use TypeScript for better type safety with your database
- Enable realtime subscriptions for live updates
- Consider implementing social auth providers (Google, GitHub, etc.)
- Set up database backups and monitoring
- Use Supabase Edge Functions for server-side logic

---

Built with ❤️ using [Supabase](https://supabase.com)
