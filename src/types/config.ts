export interface WebsiteConfig {
  // Basic Info
  clubName: string;
  clubTagline: string;
  
  // Colors
  primaryColor: string;
  accentColor: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroButtonPrimary: string;
  heroButtonSecondary: string;
  
  // About Page
  aboutTitle: string;
  aboutDescription: string;
  missionTitle: string;
  missionDescription: string;
  innovationTitle: string;
  innovationDescription: string;
  communityTitle: string;
  communityDescription: string;
  storyTitle: string;
  storyParagraph1: string;
  storyParagraph2: string;
  
  // Team Members
  teamMembers: TeamMember[];
  
  // Announcements
  announcements: Announcement[];
  
  // Gallery
  galleryItems: GalleryItem[];
  
  // FAQ
  faqs: FAQ[];
  
  // Calendar Events
  events: CalendarEvent[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  linkedin?: string;
  twitter?: string;
}

export interface Announcement {
  title: string;
  date: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

export interface GalleryItem {
  title: string;
  category: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CalendarEvent {
  title: string;
  date: string; // ISO date string
  description: string;
}

export const defaultConfig: WebsiteConfig = {
  clubName: "Your Club",
  clubTagline: "ClubTech",
  primaryColor: "#3b82f6",
  accentColor: "#8b5cf6",
  heroTitle: "Welcome to Your Club",
  heroSubtitle: "Building the future, one event at a time",
  heroButtonPrimary: "Get Started",
  heroButtonSecondary: "Learn More",
  aboutTitle: "About Us",
  aboutDescription: "We're revolutionizing how high school clubs connect with their communities through premium, AI-powered web platforms.",
  missionTitle: "Our Mission",
  missionDescription: "To empower high school clubs with professional, AI-powered websites that enhance their presence and engagement.",
  innovationTitle: "Innovation",
  innovationDescription: "We leverage cutting-edge AI technology to create beautiful, functional websites tailored to each club's unique needs.",
  communityTitle: "Community",
  communityDescription: "Building strong connections between clubs and their members through seamless digital experiences.",
  storyTitle: "Our Story",
  storyParagraph1: "Founded by a team of passionate technologists and educators, ClubTech AI emerged from a simple observation: high school clubs deserve the same quality of digital presence as major organizations. We believe that every club, regardless of its size or budget, should have access to professional-grade web solutions.",
  storyParagraph2: "By combining artificial intelligence with modern design principles, we've created a platform that not only looks stunning but also adapts to each club's unique identity and needs. Our mission is to help clubs focus on what they do best—building communities and creating memorable experiences—while we handle the technical complexities.",
  teamMembers: [
    {
      name: "Alex Johnson",
      role: "President",
      bio: "Leading our club towards innovation and excellence.",
      linkedin: "#",
      twitter: "#",
    },
  ],
  announcements: [
    {
      title: "Welcome to our club!",
      date: "November 6, 2025",
      content: "We're excited to have you here. Stay tuned for upcoming events and announcements.",
      priority: "high",
    },
  ],
  galleryItems: [
    {
      title: "Club Event",
      category: "Events",
    },
  ],
  faqs: [
    {
      question: "How do I join the club?",
      answer: "Joining our club is easy! Simply attend one of our open meetings or contact us through our website.",
    },
  ],
  events: [
    {
      title: "Club Meeting",
      date: new Date().toISOString(),
      description: "Monthly general meeting",
    },
  ],
};

