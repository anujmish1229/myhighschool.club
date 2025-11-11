# Quick Start Guide

## ✅ What's Been Done

Your admin panel now supports **nested URL structure** with high school selection!

**New URLs**: `/pickering-high-school/robotics-club` instead of just `/robotics-club`

## 🚀 Get Started in 3 Steps

### Step 1: Update Your Database

Run this SQL in your Supabase SQL Editor (go to https://supabase.com/dashboard):

```sql
-- Clean slate (optional)
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS templates CASCADE;

-- Templates catalog
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  default_config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Club sites
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

-- Turn on RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Access policies
CREATE POLICY "Users can view their own schools"
  ON schools FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own schools"
  ON schools FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own schools"
  ON schools FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own schools"
  ON schools FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view templates"
  ON templates FOR SELECT TO authenticated USING (true);

-- Seed templates (safe to run multiple times)
INSERT INTO templates (id, name, description, default_config) VALUES
  (
    '64a6e4b0-1c3f-4e6c-9f91-d2b36e0c1234',
    'Modern Club Template',
    'A beautiful, modern template perfect for any high school club',
    '{
      "clubName": "Your Club",
      "clubTagline": "ClubTech",
      "primaryColor": "#3b82f6",
      "accentColor": "#8b5cf6",
      "heroTitle": "Welcome to Your Club",
      "heroSubtitle": "Building the future, one event at a time",
      "heroButtonPrimary": "Get Started",
      "heroButtonSecondary": "Learn More",
      "aboutTitle": "About Us",
      "aboutDescription": "We are a community of passionate individuals.",
      "missionTitle": "Our Mission",
      "missionDescription": "To create meaningful experiences.",
      "innovationTitle": "Innovation",
      "innovationDescription": "We leverage modern technology.",
      "communityTitle": "Community",
      "communityDescription": "Building strong connections.",
      "storyTitle": "Our Story",
      "storyParagraph1": "Founded by passionate students...",
      "storyParagraph2": "We continue to grow and evolve...",
      "teamMembers": [{"name": "Alex Johnson", "role": "President", "bio": "Leading our club.", "linkedin": "#", "twitter": "#"}],
      "announcements": [{"title": "Welcome!", "date": "2025-11-06", "content": "Welcome to our club!", "priority": "high"}],
      "galleryItems": [{"title": "Club Event", "category": "Events"}],
      "faqs": [{"question": "How do I join?", "answer": "Contact us through our website!"}],
      "events": [{"title": "Club Meeting", "date": "2025-11-15T18:00:00Z", "description": "Monthly meeting"}]
    }'::jsonb
  ),
  (
    '7f0b8b20-2a6c-4d0e-84f1-9fb5e2b56789',
    'DECA Glow Template',
    'Bold single-page layout inspired by DECA branding.',
    '{
      "clubName": "GlowHub DECA",
      "clubTagline": "We Mean Business",
      "primaryColor": "#1d1b7f",
      "accentColor": "#f97316",
      "heroTitle": "GlowHub DECA Ignites Future Leaders",
      "heroSubtitle": "Compete. Connect. Lead with confidence under the spotlight.",
      "heroButtonPrimary": "Meet the Chapter",
      "heroButtonSecondary": "Our Mission",
      "aboutTitle": "About Our Chapter",
      "aboutDescription": "GlowHub DECA is a community of emerging leaders preparing for college and the workforce through competitive events that mirror the real world.",
      "missionTitle": "Mission",
      "missionDescription": "Empower every member to develop business acumen through experiential learning and competition.",
      "innovationTitle": "Innovation",
      "innovationDescription": "We explore modern business challenges with creativity, collaboration, and data-driven decisions.",
      "communityTitle": "Community",
      "communityDescription": "Building a supportive network that celebrates wins, learns from losses, and grows together.",
      "storyTitle": "Our Story",
      "storyParagraph1": "Founded by student entrepreneurs, GlowHub DECA has become a catalyst for professional growth and lasting friendships.",
      "storyParagraph2": "From conference podiums to community projects, our chapter brings bold ideas to life.",
      "teamMembers": [
        {"name": "Jordan Lee", "role": "Chapter President", "bio": "Guides the executive team and leads conference delegation."},
        {"name": "Priya Shah", "role": "Vice President", "bio": "Oversees competitions and member readiness workshops."}
      ],
      "announcements": [
        {"title": "Case Crack Night", "date": "2025-11-20", "content": "Join us for a hands-on prep session with alumni judges.", "priority": "high"},
        {"title": "Provincials Registration", "date": "2025-12-04", "content": "Payments and paperwork due by Friday 4 PM.", "priority": "medium"}
      ],
      "galleryItems": [
        {"title": "ICDC Team", "category": "Competition"},
        {"title": "Fundraising Gala", "category": "Community"}
      ],
      "faqs": [
        {"question": "Do I need experience to join?", "answer": "No experience needed - just curiosity and willingness to learn."},
        {"question": "How often do we meet?", "answer": "Weekly on Wednesdays after school with extra prep before conferences."}
      ],
      "events": [
        {"title": "Weekly Strategy Lab", "date": "2025-11-27T21:00:00Z", "description": "Team training and mock roleplays."},
        {"title": "Regional Qualifiers", "date": "2026-01-12T14:00:00Z", "description": "Compete to secure a spot at provincials."}
      ]
    }'::jsonb
  )
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      description = EXCLUDED.description,
      default_config = EXCLUDED.default_config;
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

