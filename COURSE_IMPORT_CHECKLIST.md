# Course Import Checklist

This document lists all courses that have SQL files ready to be imported into Supabase. After fixing UUID conflicts, all these files should now run successfully.

## ✅ Courses Ready to Import (22 total)

Run these SQL files in your Supabase SQL Editor in any order:

### 1. Core Classes
- [ ] `insert-plan-your-week-sessions.sql` - Plan Your Week (UUID: 000000000001)
- [ ] `insert-rooted-weight-health-sessions.sql` - Rooted Weight Health (UUID: 000000000014) ⚠️ **FIXED UUID**
- [ ] `insert-wisdom-rising-sessions.sql` - Wisdom Rising - Tuesdays 4pm ET (UUID: 000000000002)
- [ ] `insert-hatha-yoga-sessions.sql` - Hatha Yoga with Meghan - Mon/Thurs 4pm ET (UUID: 000000000003)

### 2. Wellness & Growth
- [ ] `insert-grief-growth-sessions.sql` - Grief & Growth (UUID: 000000000015) ⚠️ **FIXED UUID**
- [ ] `insert-reflecting-pool-sessions.sql` - The Reflecting Pool (UUID: 000000000004)
- [ ] `insert-seedlings-sessions.sql` - Seedlings - Mondays 5:30pm ET (UUID: 000000000009)
- [ ] `insert-tangled-sessions.sql` - Tangled: Challenging Relationships - Thursdays 1:30pm ET (UUID: 000000000019) ⚠️ **FIXED UUID**

### 3. Movement & Fitness
- [ ] `insert-foundations-in-motion-sessions.sql` - Foundations in Motion (UUID: 000000000005)
- [ ] `insert-strength-in-motion-sessions.sql` - Strength in Motion (UUID: 000000000011)
- [ ] `insert-energy-in-motion-sessions.sql` - Energy in Motion (UUID: 000000000012)
- [ ] `insert-made-2-move-sessions.sql` - Made 2 Move: Group Exercise Replays (UUID: 000000000018) ⚠️ **FIXED UUID**

### 4. Nourishment & Lifestyle
- [ ] `insert-heart-of-nourishment-sessions.sql` - The Heart of Nourishment (UUID: 000000000017) ⚠️ **FIXED UUID**
- [ ] `insert-2-bite-tuesdays-sessions.sql` - 2-Bite Tuesday at 10pm ET (UUID: 000000000007)

### 5. Meditation & Mindfulness
- [ ] `insert-instinctive-meditation-sessions.sql` - Instinctive Meditation - Wednesdays 7pm ET (UUID: 000000000008)
- [ ] `insert-nighttime-nurturing-sessions.sql` - Nighttime Nurturing- Fridays @ 11pm ET (UUID: 000000000006)
- [ ] `insert-inner-chords-sessions.sql` - Inner Chords - Tuesdays 8am ET (UUID: 000000000013)

### 6. Personal Development
- [ ] `insert-habit-lab-sessions.sql` - The Habit Lab (UUID: 000000000010)
- [ ] `insert-refreshed-ready-sessions.sql` - Refreshed & Ready (UUID: 000000000020) ⚠️ **FIXED UUID**
- [ ] `insert-evenings-with-emily-b-sessions.sql` - Evenings with Emily B (UUID: 000000000021) ⚠️ **FIXED UUID**
- [ ] `insert-declutter-to-breathe-sessions.sql` - Declutter to Breathe (UUID: 000000000022) ⚠️ **FIXED UUID**
- [ ] `insert-time-management-replay-sessions.sql` - Time Management Replay (UUID: 000000000016) ⚠️ **FIXED UUID**

## ⚠️ UUID Conflicts Fixed

The following courses had UUID conflicts that have been resolved:
- **Rooted Weight Health**: Changed from UUID 000000000002 → 000000000014 (was conflicting with Wisdom Rising)
- **Grief & Growth**: Changed from UUID 000000000003 → 000000000015 (was conflicting with Hatha Yoga)
- **Time Management Replay**: Changed from UUID 000000000004 → 000000000016 (was conflicting with Reflecting Pool)
- **Heart of Nourishment**: Changed from UUID 000000000005 → 000000000017 (was conflicting with Foundations in Motion)
- **Made 2 Move**: Changed from UUID 000000000006 → 000000000018 (was conflicting with Nighttime Nurturing)
- **Tangled**: Changed from UUID 000000000007 → 000000000019 (was conflicting with 2-Bite Tuesdays)
- **Refreshed Ready**: Changed from UUID 000000000008 → 000000000020 (was conflicting with Instinctive Meditation)
- **Evenings with Emily B**: Changed from UUID 000000000009 → 000000000021 (was conflicting with Seedlings)
- **Declutter to Breathe**: Changed from UUID 000000000010 → 000000000022 (was conflicting with Habit Lab)

## 📝 Instructions

1. **Open Supabase SQL Editor**
2. **Run each SQL file one at a time** (you can run them in any order now that UUIDs are fixed)
3. **Check for errors** - Each file should complete without errors
4. **Verify imports** - Use the verification queries at the end of each SQL file to confirm sessions were inserted

## 🐛 Troubleshooting

If a course still doesn't show up after running the SQL file:
1. Check the course title in the database matches what's in `courseStyles` in `Classes.tsx`
2. Verify the `course_id` in `recorded_sessions` matches the course `id` in `courses` table
3. Check that sessions have `course_id` populated (not NULL)
4. Verify the course is being queried by the frontend (check `useCourses` hook)

