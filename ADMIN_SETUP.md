# Admin Panel Setup Guide

This guide will help you set up the admin panel for managing club websites.

## Features Integrated

✅ **Authentication System**
- Google OAuth login
- Protected admin routes
- User session management

✅ **Admin Dashboard**
- View all your club websites
- Create new club websites
- Edit existing clubs
- Manage club configurations

✅ **Multi-Step Setup Wizard**
- 7-step configuration process
- Club basic information
- Hero section customization
- About page content
- Team members management
- Announcements & events
- Gallery items
- FAQ management

✅ **Database Integration**
- Supabase backend
- Real-time data synchronization
- Secure data storage

## Setup Instructions

### 1. Install Dependencies

Dependencies have already been added to `package.json`. Run:

```bash
npm install
```

### 2. Set Up Supabase

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Go to Project Settings > API
4. Copy your project URL and anon key
5. Create a `.env` file in the root directory:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Database Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create schools table (clubs)
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

-- Create templates table
CREATE TABLE templates (
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

-- Insert default templates (idempotent)
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

### 4. Configure Google OAuth

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Add authorized redirect URLs:
   - `http://localhost:5173/dashboard` (for development)
   - `https://yourdomain.com/dashboard` (for production)

## Admin Routes

The following routes have been added to your application:

- `/login` - Admin login page (Google OAuth)
- `/dashboard` - Admin dashboard (protected)
- `/edit/:slug` - Edit club website (protected)

## Usage

### Creating a New Club Website

1. Navigate to `/login` and sign in with Google
2. You'll be redirected to `/dashboard`
3. Click "Create New Club Website"
4. Fill in the slug (URL identifier) for your club
5. Select a template
6. Complete the 7-step setup wizard
7. Your club website will be live at `/:slug`

### Editing an Existing Club

1. Go to `/dashboard`
2. Find your club in the list
3. Click "Edit"
4. Update the configuration through the setup wizard
5. Click "Finish & View Website"

## File Structure

```
src/
├── context/
│   ├── AuthContext.tsx       # Authentication context
│   └── ConfigContext.tsx     # Club configuration context
├── pages/
│   ├── Login.tsx             # Login page
│   ├── Dashboard.tsx         # Admin dashboard
│   ├── EditSchool.tsx        # Edit club page
│   └── Setup.tsx             # Multi-step setup wizard
├── components/
│   ├── ProtectedRoute.tsx    # Route protection
│   ├── GlassCard.tsx         # Glass morphism card
│   ├── NeuButton.tsx         # Neumorphic button
│   └── PageLayout.tsx        # Page layout wrapper
├── lib/
│   └── supabase.ts           # Supabase client
└── types/
    └── config.ts             # TypeScript types
```

## Next Steps

1. Complete the Supabase setup
2. Configure Google OAuth
3. Run the development server: `npm run dev`
4. Navigate to `/login` to test the admin panel
5. Create your first club website!

## Support

For issues or questions:
- Check the Supabase documentation: https://supabase.com/docs
- Review the React Router docs: https://reactrouter.com
- Check the integrated code comments

---

**Note:** Make sure to never commit your `.env` file to version control. The `.env.example` file has been provided as a template.

