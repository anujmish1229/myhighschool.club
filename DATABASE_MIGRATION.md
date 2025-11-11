# Database Migration Guide

## Important: Migrating to New URL Structure

The URL structure has been updated from `/club-slug` to `/school-slug/club-slug`.

### If You Already Have a Database

If you already created the `schools` table, you need to **drop and recreate** it with the new structure.

⚠️ **Warning**: This will delete all existing club data. If you have important data, export it first!

#### Step 1: Drop Existing Table

Run this in your Supabase SQL Editor:

```sql
-- Drop existing table and policies
DROP POLICY IF EXISTS "Users can view their own schools" ON schools;
DROP POLICY IF EXISTS "Users can insert their own schools" ON schools;
DROP POLICY IF EXISTS "Users can update their own schools" ON schools;
DROP POLICY IF EXISTS "Users can delete their own schools" ON schools;
DROP TABLE IF EXISTS schools;
```

#### Step 2: Create New Table Structure

```sql
-- Create schools table with new structure (clubs)
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

-- Create templates table (if not already created)
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  default_config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Schools policies
CREATE POLICY "Users can view their own schools"
  ON schools FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schools"
  ON schools FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schools"
  ON schools FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schools"
  ON schools FOR DELETE
  USING (auth.uid() = user_id);

-- Templates policies (read-only for all authenticated users)
CREATE POLICY "Anyone can view templates"
  ON templates FOR SELECT
  TO authenticated
  USING (true);

-- Seed templates (safe to rerun)
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

### New URL Structure

- **Old**: `myhighschool.club/robotics-club`
- **New**: `myhighschool.club/pickering-high-school/robotics-club`

### Key Changes

1. **High School Selection**: When creating a club, you must select from the Ontario schools list
2. **Nested URLs**: Clubs are now nested under their high schools
3. **Unique Constraint**: The combination of `high_school_slug` and `club_slug` must be unique

### Example Data

```sql
-- Example club entry
{
  "high_school_slug": "pickering-high-school",
  "club_slug": "robotics-club",
  "config": {...}
}

-- This creates the URL:
-- myhighschool.club/pickering-high-school/robotics-club
```

## Testing

After running the migration:

1. Go to `/login` and sign in
2. Go to `/dashboard`
3. Click "Create New Club Website"
4. Search for and select a high school (e.g., "Pickering High School")
5. Enter a club slug (e.g., "robotics-club")
6. Complete the setup wizard
7. Your club will be available at `/pickering-high-school/robotics-club`

## Rollback

If you need to rollback to the old structure:

```sql
-- Recreate old structure
DROP TABLE IF EXISTS schools;

CREATE TABLE schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_slug TEXT UNIQUE NOT NULL,
  template_id UUID NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Re-enable RLS and policies
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
-- (Add policies back)
```

---

**Note**: Make sure you've backed up any important data before running these migrations!

