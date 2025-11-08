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

-- Insert a default template (if it doesn't exist)
INSERT INTO templates (name, description, default_config)
SELECT 
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
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE name = 'Modern Club Template');
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

