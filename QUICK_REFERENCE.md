# Quick Reference Guide

## 🔗 Project URLs

**Supabase Dashboard:** https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq  
**API URL:** https://qbsrmbxuwacpqquorqaq.supabase.co  
**Database Host:** db.qbsrmbxuwacpqquorqaq.supabase.co

## 🔑 API Keys

**Publishable Key:**
```
sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3
```

**Legacy Anon Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFic3JtYnh1d2FjcHFxdW9ycWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDAxMTQsImV4cCI6MjA4MDkxNjExNH0.FwYzofr_mHmVgGU9fwldOqpwomftzVjS2Yapg-P_XqA
```

## 📁 Project Files

### Core Files
- `supabase-types.ts` - TypeScript database types
- `supabase-client.ts` - Configured Supabase client + helper functions
- `package.json` - Dependencies and scripts

### Examples
- `example-dashboard.tsx` - Complete dashboard component
- `auth-examples.tsx` - Authentication components (sign up, sign in, password reset, social auth)

### Documentation
- `README.md` - Comprehensive project documentation
- `SETUP_COMPLETE.md` - Setup summary and next steps
- `QUICK_REFERENCE.md` - This file

## 🗃️ Database Tables

### user_profiles
```sql
id          UUID PRIMARY KEY
email       TEXT
full_name   TEXT
avatar_url  TEXT
bio         TEXT
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

### dashboard_settings
```sql
id                      UUID PRIMARY KEY
user_id                 UUID (FK to auth.users)
theme                   TEXT ('light', 'dark', 'auto')
language                TEXT
notifications_enabled   BOOLEAN
email_notifications     BOOLEAN
settings_json           JSONB
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

### activity_log
```sql
id          UUID PRIMARY KEY
user_id     UUID (FK to auth.users)
action      TEXT
description TEXT
metadata    JSONB
ip_address  TEXT
user_agent  TEXT
created_at  TIMESTAMP
```

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=https://qbsrmbxuwacpqquorqaq.supabase.co" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_7gzuByfAfjneqR2O_u-eLQ_FltzyIX3" >> .env.local

# Start development server
npm run dev
```

## 💻 Common Code Snippets

### Initialize Supabase Client
```typescript
import { supabase } from './supabase-client'
```

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

### Get User Profile
```typescript
import { getUserProfile } from './supabase-client'
const { data: profile } = await getUserProfile(userId)
```

### Update Settings
```typescript
import { updateDashboardSettings } from './supabase-client'
await updateDashboardSettings(userId, { theme: 'dark' })
```

### Log Activity
```typescript
import { logActivity } from './supabase-client'
await logActivity(userId, 'action_name', 'Description', { key: 'value' })
```

## 🔐 Security Checklist

- ✅ Row Level Security enabled on all tables
- ✅ Users can only access their own data
- ✅ Database functions are secure
- ✅ RLS policies optimized for performance
- ✅ Foreign key constraints in place
- ⚠️ Store API keys in environment variables only
- ⚠️ Never commit .env files to git

## 📦 Required Dependencies

```json
{
  "@supabase/supabase-js": "^2.39.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "next": "^14.0.4"
}
```

## 🎯 Feature Checklist

### ✅ Completed
- [x] Supabase project created
- [x] Database schema with 3 tables
- [x] Row Level Security policies
- [x] TypeScript types generated
- [x] Helper functions created
- [x] Example components provided
- [x] Documentation written
- [x] Security & performance optimized

### 📋 Next Steps
- [ ] Build authentication UI
- [ ] Implement dashboard pages
- [ ] Add file upload (avatars)
- [ ] Set up social auth providers
- [ ] Configure email templates
- [ ] Add real-time subscriptions
- [ ] Deploy to production
- [ ] Set up monitoring

## 🆘 Troubleshooting

### Can't connect to Supabase?
- Check your API keys are correct
- Verify environment variables are loaded
- Ensure project is active in Supabase dashboard

### RLS blocking queries?
- Make sure user is authenticated
- Check policies match your query
- Test with service role key (for debugging only)

### Type errors?
- Regenerate types: Import from supabase-types.ts
- Check table schemas match your code
- Ensure TypeScript version is compatible

## 🔗 Useful Links

- [Project Dashboard](https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq)
- [Database Tables](https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/editor)
- [API Logs](https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/logs/explorer)
- [Auth Settings](https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/auth/users)
- [SQL Editor](https://supabase.com/dashboard/project/qbsrmbxuwacpqquorqaq/sql/new)

---

**Pro Tip:** Bookmark this file for quick access to credentials and common commands!

