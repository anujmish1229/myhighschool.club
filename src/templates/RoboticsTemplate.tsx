import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useConfig } from '@/context/ConfigContext';
import {
  Award,
  Trophy,
  Medal,
  Users,
  Lightbulb,
  Wrench,
  Code,
  Megaphone,
  ArrowRight,
  Menu,
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

// Default robot images (can be overridden in config)
const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070';
const DEFAULT_ROBOT_1 = 'https://images.unsplash.com/photo-1563207153-f403bf289096?q=80&w=2071';
const DEFAULT_ROBOT_2 = 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=2070';
const DEFAULT_ROBOT_3 = 'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?q=80&w=2071';

const NAV_LINKS = [
  { label: 'About', target: 'about' },
  { label: 'Team', target: 'team' },
  { label: 'Robots', target: 'robots' },
  { label: 'Announcements', target: 'announcements' },
  { label: 'Calendar', target: 'calendar' },
];

type TemplateCSSVars = CSSProperties & {
  '--template-background': string;
  '--template-foreground': string;
  '--template-card': string;
  '--template-card-foreground': string;
  '--template-primary': string;
  '--template-primary-foreground': string;
  '--template-secondary': string;
  '--template-secondary-foreground': string;
  '--template-accent': string;
  '--template-accent-foreground': string;
  '--template-muted': string;
  '--template-muted-foreground': string;
  '--template-border': string;
};

// Default colors from robohub-connect (HSL format)
const DEFAULT_PRIMARY = 'hsl(210, 100%, 56%)'; // Blue #3B9CF5
const DEFAULT_ACCENT = 'hsl(195, 100%, 50%)'; // Cyan (blue-to-cyan gradient by default)
const DEFAULT_BACKGROUND = 'hsl(220, 30%, 6%)'; // Dark background
const DEFAULT_FOREGROUND = 'hsl(210, 40%, 98%)'; // Light text

// Convert hex to HSL
const hexToHSL = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return DEFAULT_PRIMARY;
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `hsl(${h}, ${s}%, ${l}%)`;
};

const isValidHexColor = (color: string | undefined): color is string =>
  typeof color === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(color.trim());

const RoboticsTemplate = () => {
  const { config } = useConfig();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryColor = useMemo(() => {
    if (isValidHexColor(config.primaryColor)) {
      return hexToHSL(config.primaryColor);
    }
    return DEFAULT_PRIMARY;
  }, [config.primaryColor]);

  const accentColor = useMemo(() => {
    if (isValidHexColor(config.accentColor)) {
      return hexToHSL(config.accentColor);
    }
    return DEFAULT_ACCENT;
  }, [config.accentColor]);

  const cssVars = useMemo<TemplateCSSVars>(
    () => ({
      '--template-background': DEFAULT_BACKGROUND,
      '--template-foreground': DEFAULT_FOREGROUND,
      '--template-card': 'hsl(220, 25%, 8%)',
      '--template-card-foreground': DEFAULT_FOREGROUND,
      '--template-primary': primaryColor,
      '--template-primary-foreground': DEFAULT_BACKGROUND,
      '--template-secondary': accentColor,
      '--template-secondary-foreground': DEFAULT_BACKGROUND,
      '--template-accent': accentColor,
      '--template-accent-foreground': DEFAULT_BACKGROUND,
      '--template-muted': 'hsl(220, 20%, 15%)',
      '--template-muted-foreground': 'hsl(215, 20%, 65%)',
      '--template-border': 'hsl(220, 20%, 15%)',
    }),
    [primaryColor, accentColor],
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const teamMembers = Array.isArray(config.teamMembers) ? config.teamMembers : [];
  const announcements = Array.isArray(config.announcements) ? config.announcements : [];
  const events = Array.isArray(config.events) ? config.events : [];
  const faqs = Array.isArray(config.faqs) ? config.faqs : [];
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get images from config or use defaults
  const heroImage = (config as any).heroImage || DEFAULT_HERO_IMAGE;
  const robotImage1 = (config as any).robotImage1 || DEFAULT_ROBOT_1;
  const robotImage2 = (config as any).robotImage2 || DEFAULT_ROBOT_2;
  const robotImage3 = (config as any).robotImage3 || DEFAULT_ROBOT_3;

  const achievements = announcements.length > 0
    ? announcements.map((announcement, index) => ({
        icon: [Trophy, Medal, Award, Lightbulb][index % 4] || Trophy,
        title: announcement.title,
        description: announcement.content,
      }))
    : [
        {
          icon: Trophy,
          title: 'Regional Champions',
          description: '2023 Regional Competition Winners',
        },
        {
          icon: Award,
          title: 'Innovation Award',
          description: 'Recognized for creative engineering solutions',
        },
        {
          icon: Users,
          title: '30+ Members',
          description: 'Diverse team of passionate students',
        },
        {
          icon: Lightbulb,
          title: 'STEM Leaders',
          description: 'Promoting robotics education in our community',
        },
      ];

  const departments = [
    {
      icon: Wrench,
      name: 'Mechanical',
      description: 'Design and build robot mechanisms',
    },
    {
      icon: Code,
      name: 'Programming',
      description: 'Develop autonomous and driver control software',
    },
    {
      icon: Megaphone,
      name: 'Outreach',
      description: 'Promote STEM in our community',
    },
    {
      icon: Users,
      name: 'Business',
      description: 'Manage sponsorships and operations',
    },
  ];

  const robots = [
    {
      name: 'Nexus',
      year: '2024',
      image: robotImage1,
      description: 'Advanced autonomous capabilities with precision handling',
    },
    {
      name: 'Apex',
      year: '2023',
      image: robotImage2,
      description: 'Championship robot with innovative mechanisms',
    },
    {
      name: 'Titan',
      year: '2022',
      image: robotImage3,
      description: 'Tank-drive powerhouse with lifting capabilities',
    },
  ];

  // Calendar helpers
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array.from({ length: startDayOfWeek });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div
      style={cssVars}
      className="min-h-screen bg-[var(--template-background)] text-[var(--template-foreground)]"
    >
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[var(--template-background)]/80 backdrop-blur-md border-b border-[var(--template-border)]' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xl text-[var(--template-primary-foreground)]"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
              }}
            >
              {config.clubName?.substring(0, 2).toUpperCase() || 'RT'}
            </div>
            <span className="font-bold text-xl text-[var(--template-foreground)]">
              {config.clubName || 'RoboTech Team'}
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollToSection(link.target)}
                className="text-[var(--template-muted-foreground)] hover:text-[var(--template-foreground)] transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection('announcements')}
              className="text-[var(--template-primary-foreground)] transition-all hover:shadow-[0_0_40px_var(--template-primary)]"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
              }}
            >
              Join Us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[var(--template-foreground)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[var(--template-card)] border-b border-[var(--template-border)] px-4 py-4">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.target}
                  onClick={() => scrollToSection(link.target)}
                  className="text-[var(--template-muted-foreground)] hover:text-[var(--template-foreground)] transition-colors text-left py-2"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection('announcements')}
                className="w-full text-[var(--template-primary-foreground)] mt-2"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                }}
              >
                Join Us
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImage})`,
              filter: 'brightness(0.4)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--template-background)]/50 to-[var(--template-background)]" />

          <div className="relative z-10 container mx-auto px-4 text-center pt-20">
            <div
              className="inline-block mb-4 px-4 py-2 rounded-full border"
              style={{
                backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)`,
                borderColor: `color-mix(in srgb, ${primaryColor} 30%, transparent)`,
              }}
            >
              <span className="font-medium" style={{ color: primaryColor }}>
                {config.clubTagline || 'FRC Team #XXXX'}
              </span>
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold mb-6"
              style={{
                background: `linear-gradient(to right, var(--template-foreground), ${primaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {config.heroTitle || config.clubName || 'RoboTech Team'}
            </h1>

            <p className="text-xl md:text-2xl text-[var(--template-muted-foreground)] max-w-2xl mx-auto mb-8">
              {config.heroSubtitle || 'Building the future, one robot at a time. Innovation, teamwork, and excellence in robotics.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => scrollToSection('about')}
                className="text-lg px-8 text-[var(--template-primary-foreground)] transition-all hover:shadow-[0_0_40px_var(--template-primary)]"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                }}
              >
                {config.heroButtonPrimary || 'Learn More'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('announcements')}
                className="text-lg px-8 border-[var(--template-primary)] hover:bg-[var(--template-primary)]/10"
                style={{ 
                  borderColor: primaryColor,
                  color: primaryColor,
                }}
              >
                {config.heroButtonSecondary || 'Join The Team'}
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {config.aboutTitle || 'About Our Team'}
              </h2>
              <p className="text-xl text-[var(--template-muted-foreground)] max-w-3xl mx-auto">
                {config.aboutDescription ||
                  'We are a student-led robotics team dedicated to designing, building, and programming competitive robots while fostering skills in STEM, teamwork, and leadership.'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className="bg-[var(--template-card)] border-[var(--template-border)] text-center transition-all hover:shadow-[0_0_30px_var(--template-primary)] hover:border-[var(--template-primary)]/50 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-sm"
                >
                  <CardContent className="p-6">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-lg mb-4 mx-auto"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                      }}
                    >
                      <achievement.icon className="h-8 w-8" style={{ color: 'var(--template-primary-foreground)' }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                    <p className="text-[var(--template-muted-foreground)]">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mission Statement */}
            <div className="mt-16 max-w-4xl mx-auto bg-[var(--template-card)] border border-[var(--template-border)] rounded-lg p-8 md:p-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {config.missionTitle || 'Our Mission'}
              </h3>
              <p className="text-lg text-[var(--template-muted-foreground)]">
                {config.missionDescription ||
                  'To inspire and empower students through hands-on robotics experience, fostering innovation, critical thinking, and collaborative problem-solving in a supportive environment.'}
              </p>
            </div>
          </div>
        </section>

        {/* Team Departments Section */}
        <section id="team" className="py-20 bg-[var(--template-muted)]/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h2>
              <p className="text-xl text-[var(--template-muted-foreground)] max-w-3xl mx-auto">
                Our team is organized into specialized departments, each contributing unique skills and perspectives to create championship-winning robots.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 justify-items-center max-w-6xl mx-auto">
              {departments.map((dept, index) => (
                <Card
                  key={index}
                  className="bg-[var(--template-card)]/50 backdrop-blur border-[var(--template-border)] transition-all hover:shadow-[0_0_30px_var(--template-primary)] hover:border-[var(--template-primary)]/50 w-full max-w-sm"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className="inline-flex items-center justify-center w-14 h-14 rounded-lg mb-4 mx-auto"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                      }}
                    >
                      <dept.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{dept.name}</h3>
                    <p className="text-[var(--template-muted-foreground)]">{dept.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Team Members */}
            {teamMembers.length > 0 && (
              <div className="mt-16">
                <h3 className="text-3xl font-bold text-center mb-12">Team Leadership</h3>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 justify-items-center max-w-6xl mx-auto">
                  {teamMembers.map((member, idx) => (
                    <Card
                      key={`${member.name}-${idx}`}
                      className="bg-[var(--template-card)] border-[var(--template-border)] overflow-hidden transition-all hover:shadow-[0_0_30px_var(--template-primary)] hover:border-[var(--template-primary)]/50 w-full max-w-sm"
                    >
                      <CardContent className="p-6">
                        <div
                          className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                          }}
                        >
                          <Users className="h-12 w-12" style={{ color: 'var(--template-primary-foreground)' }} />
                        </div>
                        <h3 className="text-xl font-bold text-center">{member.name}</h3>
                        <p
                          className="mt-2 text-center text-sm font-semibold uppercase tracking-wider"
                          style={{ color: primaryColor }}
                        >
                          {member.role}
                        </p>
                        <p className="mt-3 text-center text-sm text-[var(--template-muted-foreground)]">{member.bio}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Meeting Info */}
            <div className="mt-16 text-center">
              <p className="text-lg text-[var(--template-muted-foreground)] mb-6">
                Want to be part of something amazing? We welcome students with all skill levels and interests!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div
                  className="px-6 py-3 rounded-full border"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)`,
                    borderColor: `color-mix(in srgb, ${primaryColor} 30%, transparent)`,
                  }}
                >
                  <span className="font-medium" style={{ color: primaryColor }}>
                    {events.length > 0
                      ? `Meets: ${new Date(events[0].date).toLocaleDateString()}`
                      : 'Meets: Mon & Wed 3-6 PM'}
                  </span>
                </div>
                <div
                  className="px-6 py-3 rounded-full border"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
                    borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`,
                  }}
                >
                  <span className="font-medium" style={{ color: accentColor }}>
                    Location: Building 4, Room 210
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Robots Section */}
        <section id="robots" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Robots</h2>
              <p className="text-xl text-[var(--template-muted-foreground)] max-w-3xl mx-auto">
                Each season brings new challenges and opportunities to showcase our engineering excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-6xl mx-auto">
              {robots.map((robot, index) => (
                <Card
                  key={index}
                  className="overflow-hidden bg-[var(--template-card)] border-[var(--template-border)] transition-all hover:shadow-[0_0_30px_var(--template-primary)] hover:border-[var(--template-primary)]/50 group w-full max-w-sm"
                >
                  <div className="aspect-square overflow-hidden bg-[var(--template-muted)]">
                    <img
                      src={robot.image}
                      alt={robot.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold">{robot.name}</h3>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium border"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, transparent)`,
                          borderColor: `color-mix(in srgb, ${primaryColor} 30%, transparent)`,
                          color: primaryColor,
                        }}
                      >
                        {robot.year}
                      </span>
                    </div>
                    <p className="text-[var(--template-muted-foreground)]">{robot.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Announcements Section */}
        {announcements.length > 0 && (
          <section id="announcements" className="py-20 bg-[var(--template-muted)]/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Announcements</h2>
                <p className="text-xl text-[var(--template-muted-foreground)] max-w-3xl mx-auto">
                  Stay updated with the latest news and events from our team.
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                {announcements.map((announcement, index) => (
                  <Card
                    key={index}
                    className="bg-[var(--template-card)] border-[var(--template-border)] transition-all hover:shadow-[0_0_30px_var(--template-primary)] hover:border-[var(--template-primary)]/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                          }}
                        >
                          <Megaphone className="h-6 w-6" style={{ color: 'var(--template-primary-foreground)' }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold">{announcement.title}</h3>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium border"
                              style={{
                                backgroundColor: `color-mix(in srgb, ${announcement.priority === 'high' ? primaryColor : accentColor} 10%, transparent)`,
                                borderColor: `color-mix(in srgb, ${announcement.priority === 'high' ? primaryColor : accentColor} 30%, transparent)`,
                                color: announcement.priority === 'high' ? primaryColor : accentColor,
                              }}
                            >
                              {announcement.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--template-muted-foreground)] mb-3">
                            <CalendarIcon className="h-4 w-4" />
                            <span>{announcement.date}</span>
                          </div>
                          <p className="text-[var(--template-muted-foreground)]">{announcement.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Calendar Section */}
        {events.length > 0 && (
          <section id="calendar" className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Upcoming Events</h2>
                <p className="text-xl text-[var(--template-muted-foreground)] max-w-3xl mx-auto">
                  Check out our schedule and join us for upcoming meetings and competitions.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 rounded-lg hover:bg-[var(--template-muted)] transition-colors"
                    style={{ color: primaryColor }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <h3 className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h3>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-lg hover:bg-[var(--template-muted)] transition-colors"
                    style={{ color: primaryColor }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <Card className="bg-[var(--template-card)] border-[var(--template-border)] mb-8">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-7 gap-2">
                      {/* Day headers */}
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-sm font-semibold text-[var(--template-muted-foreground)] py-2">
                          {day}
                        </div>
                      ))}

                      {/* Empty cells */}
                      {emptyDays.map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square" />
                      ))}

                      {/* Calendar days */}
                      {daysInMonth.map((day) => {
                        const dayEvents = getEventsForDay(day);
                        const hasEvents = dayEvents.length > 0;
                        const isCurrentDay = isToday(day);

                        return (
                          <div
                            key={day.toISOString()}
                            className={`aspect-square p-2 rounded-lg transition-all ${
                              isCurrentDay
                                ? 'border-2'
                                : hasEvents
                                  ? 'border border-[var(--template-primary)]/30'
                                  : 'hover:bg-[var(--template-muted)]/20'
                            }`}
                            style={{
                              backgroundColor: isCurrentDay
                                ? `color-mix(in srgb, ${primaryColor} 20%, transparent)`
                                : hasEvents
                                  ? `color-mix(in srgb, ${primaryColor} 10%, transparent)`
                                  : 'transparent',
                              borderColor: isCurrentDay ? primaryColor : undefined,
                            }}
                          >
                            <div className="flex flex-col h-full">
                              <span
                                className={`text-sm ${
                                  isCurrentDay
                                    ? 'font-bold'
                                    : hasEvents
                                      ? 'font-semibold'
                                      : 'text-[var(--template-muted-foreground)]'
                                }`}
                                style={{
                                  color: isCurrentDay || hasEvents ? primaryColor : undefined,
                                }}
                              >
                                {format(day, 'd')}
                              </span>
                              {hasEvents && (
                                <div className="flex-1 flex items-center justify-center">
                                  <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: primaryColor }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Event List */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold mb-6">This Month</h3>
                  <div className="space-y-4">
                    {events
                      .filter((event) => isSameMonth(new Date(event.date), currentDate))
                      .map((event, index) => (
                        <Card
                          key={index}
                          className="bg-[var(--template-card)] border-[var(--template-border)] transition-all hover:shadow-[0_0_30px_var(--template-primary)] hover:border-[var(--template-primary)]/50"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-bold text-lg mb-2">{event.title}</h4>
                                <p className="text-sm text-[var(--template-muted-foreground)]">{event.description}</p>
                              </div>
                              <div className="text-right ml-4">
                                <div
                                  className="text-sm font-semibold"
                                  style={{ color: primaryColor }}
                                >
                                  {format(new Date(event.date), 'MMM d')}
                                </div>
                                <div className="text-xs text-[var(--template-muted-foreground)]">
                                  {format(new Date(event.date), 'h:mm a')}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="py-20">
            <div className="container mx-auto max-w-4xl px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <details
                    key={`${faq.question}-${idx}`}
                    className="rounded-xl border border-[var(--template-border)] bg-[var(--template-card)] p-5"
                  >
                    <summary className="cursor-pointer text-lg font-semibold">{faq.question}</summary>
                    <p className="mt-3 text-sm text-[var(--template-muted-foreground)]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--template-card)] border-t border-[var(--template-border)] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xl"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                  color: 'var(--template-primary-foreground)',
                }}
              >
                {config.clubName?.substring(0, 2).toUpperCase() || 'RT'}
              </div>
              <div>
                <p className="font-semibold">{config.clubName || 'RoboTech Team'}</p>
                <p className="text-sm text-[var(--template-muted-foreground)]">{config.clubTagline || 'FRC Team #XXXX'}</p>
              </div>
            </div>
            <div className="text-sm text-[var(--template-muted-foreground)]">
              <p>© {new Date().getFullYear()} {config.clubName || 'RoboTech Team'}. All rights reserved.</p>
              <p className="text-xs mt-1">Building the future through robotics.</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--template-muted-foreground)]">
              Powered by{' '}
              <a
                href="https://myhighschool.club"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: primaryColor }}
              >
                myHighSchool.club
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RoboticsTemplate;

