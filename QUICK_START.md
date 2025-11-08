# Quick Start Guide

## ✅ What's Been Done

Your admin panel now supports **nested URL structure** with high school selection!

**New URLs**: `/pickering-high-school/robotics-club` instead of just `/robotics-club`

## 🚀 Get Started in 3 Steps

### Step 1: Update Your Database

Run this SQL in your Supabase SQL Editor (go to https://supabase.com/dashboard):

```sql
-- If you already have a schools table, drop it first
DROP TABLE IF EXISTS schools CASCADE;

-- Create new structure
CREATE TABLE schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  high_school_slug TEXT NOT NULL,
  club_slug TEXT NOT NULL,
  template_id UUID NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(high_school_slug, club_slug)
);

-- Enable security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view their own schools"
  ON schools FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schools"
  ON schools FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schools"
  ON schools FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schools"
  ON schools FOR DELETE USING (auth.uid() = user_id);
```

### Step 2: Add OAuth Redirect URL

In your Supabase Dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   ```
   http://localhost:5173/dashboard
   ```

### Step 3: Test It!

```bash
npm run dev
```

Then:
1. Go to `http://localhost:5173/login`
2. Sign in with Google
3. Click "Create New Club Website"
4. **Search for a high school** (e.g., "Pickering")
5. Enter a club slug (e.g., "robotics-club")
6. Complete the setup
7. Your club is live at `/pickering-high-school/robotics-club`! 🎉

## 📱 Features

### Dashboard View
- See all your clubs
- Shows high school name + club name
- Full URL display
- Edit or view any club

### Club Creation
1. **Search high schools** - Type to filter 25+ Ontario schools
2. **Select from dropdown** - Click to choose your school
3. **Enter club slug** - See URL preview in real-time
4. **Setup wizard** - 7 steps to configure everything

### URL Structure
```
Landing Page:
└── /

Admin:
├── /login
├── /dashboard
└── /edit/pickering-high-school/robotics-club

Public:
├── /pickering-high-school (school homepage)
└── /pickering-high-school/robotics-club (club page)
```

## 🆘 Troubleshooting

### "Schools table doesn't exist"
→ Run the SQL from Step 1

### "Can't find template"
→ Make sure you ran the template INSERT from `ADMIN_SETUP.md` line 119

### "Login not working"
→ Check that Google OAuth is enabled in Supabase
→ Verify redirect URL is added

### "Permission denied"
→ Make sure RLS policies were created (Step 1)

## 📚 Documentation

- **`UPDATED_FEATURES.md`** - Full list of changes
- **`DATABASE_MIGRATION.md`** - Detailed migration guide
- **`ADMIN_SETUP.md`** - Complete setup instructions

## 🎯 Quick Test

After setup, try this:
```
1. Login → /login
2. Create club:
   - School: Pickering High School
   - Club: test-club
3. Visit: /pickering-high-school/test-club
4. Should see your club website! ✨
```

---

**That's it!** You're ready to create club websites with the new structure. 🚀

