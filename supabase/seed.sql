-- Seed the template catalog (safe to run multiple times).
-- Note: the app selects templates by name. The "Robotics Tech Template"
-- (src/templates/RoboticsTemplate.tsx) needs a row named exactly that.
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
