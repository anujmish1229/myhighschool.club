import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useConfig } from '@/context/ConfigContext';
import {
  Award,
  Briefcase,
  Calendar as CalendarIcon,
  Globe,
  Mail,
  MapPin,
  Medal,
  Star,
  Trophy,
  Users,
} from 'lucide-react';

const LOGO_IMAGE =
  'https://raw.githubusercontent.com/dot-agent-sandbox/templates/main/deca-glow-hub/assets/deca-logo.png';

const NAV_LINKS = [
  { label: 'Home', target: 'home' },
  { label: 'DECA', target: 'deca' },
  { label: 'Team', target: 'team' },
  { label: 'Success', target: 'success' },
  { label: 'Join', target: 'join' },
];

type TemplateCSSVars = CSSProperties & {
  '--template-primary': string;
  '--template-primary-dark': string;
  '--template-primary-light': string;
  '--template-background': string;
  '--template-muted': string;
  '--template-muted-foreground': string;
  '--template-accent': string;
};

const DecaGlowTemplate = () => {
  const { config } = useConfig();
  const [scrolled, setScrolled] = useState(false);

  // DECA Blue color scheme - fixed blue colors, not using config colors
  const primary = '#0B6BB5'; // DECA Blue
  const primaryDark = '#074A80';
  const primaryLight = '#0E7FD1';
  const accent = '#0B6BB5';

  const cssVars = useMemo<TemplateCSSVars>(
    () => ({
      '--template-primary': primary,
      '--template-primary-dark': primaryDark,
      '--template-primary-light': primaryLight,
      '--template-background': '#ffffff',
      '--template-muted': '#f1f5f9',
      '--template-muted-foreground': '#475569',
      '--template-accent': accent,
    }),
    [primary, primaryDark, primaryLight, accent],
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
    }
  };

  const teamMembers = Array.isArray(config.teamMembers) ? config.teamMembers : [];
  const announcements = Array.isArray(config.announcements) ? config.announcements : [];
  const events = Array.isArray(config.events) ? config.events : [];
  const galleryItems = Array.isArray(config.galleryItems) ? config.galleryItems : [];
  const faqs = Array.isArray(config.faqs) ? config.faqs : [];

  const achievements =
    announcements.length > 0
      ? announcements.map((announcement, index) => ({
          icon: [Trophy, Medal, Award, Star][index % 4] || Trophy,
          title: announcement.title,
          details: announcement.content,
          meta: announcement.date,
        }))
      : [
          {
            icon: Trophy,
            title: 'International Career Development Conference',
            details: '1st Place - Marketing Management • 3rd Place - Business Finance',
            meta: '2024',
          },
          {
            icon: Medal,
            title: 'State Career Development Conference',
            details: '1st Place - Entrepreneurship • 2nd Place - Hospitality',
            meta: '2024',
          },
          {
            icon: Award,
            title: 'Regional Competition',
            details: '5 First Place Winners • 10 Qualified for State',
            meta: '2024',
          },
          {
            icon: Star,
            title: 'Chapter Recognition',
            details: 'Outstanding Chapter Award • Community Service Leader',
            meta: '2024',
          },
        ];

  const joinLocation = ['Room 201', 'Main Building'];
  const joinSchedule =
    events.length > 0
      ? [
          new Date(events[0].date).toLocaleDateString(undefined, {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
          events[0].description,
        ]
      : ['Every Wednesday', '3:30 – 4:30 PM'];

  return (
    <div style={cssVars} className="min-h-screen bg-[var(--template-background)] text-slate-900">
      <header
        className={`fixed inset-x-0 top-0 z-40 bg-[var(--template-primary)] transition-all duration-300 ${
          scrolled ? 'shadow-lg shadow-slate-900/20' : ''
        }`}
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <img src={LOGO_IMAGE} alt="DECA" className="h-12 w-12" />
            <div className="text-left text-white">
              <p className="text-xl font-bold uppercase tracking-wide">
                {config.clubName || 'DECA'}
              </p>
              <p className="text-xs opacity-90">{config.clubTagline || 'Your Chapter'}</p>
            </div>
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollToSection(link.target)}
                className="text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:text-white/80"
              >
                {link.label}
              </button>
            ))}
            <Button
              className="rounded-full bg-[var(--template-accent)] px-8 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-[0_0_25px_rgba(11,107,181,0.6)] transition hover:bg-[var(--template-primary-light)] hover:shadow-[0_0_35px_rgba(11,107,181,0.8)]"
              onClick={() => scrollToSection('join')}
            >
              Join Us
            </Button>
          </nav>
        </div>
      </header>

      <main className="space-y-24 pb-24">
        <section
          id="home"
          className="relative flex min-h-screen items-center justify-center px-4 text-center text-white"
        >
          {/* Solid blue gradient background instead of image */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--template-primary-dark)] via-[var(--template-primary)] to-[var(--template-primary-dark)]" />
          
          <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              {config.heroTitle || `DECA YOUR CHAPTER`}
            </h1>
            <p className="text-2xl font-light tracking-wide text-white/90 sm:text-2xl md:text-3xl">
              {config.heroSubtitle || 'We Mean Business'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button
                className="rounded-full bg-white px-12 py-6 text-lg font-semibold text-[var(--template-primary)] shadow-[0_0_30px_rgba(255,255,255,0.5)] transition hover:bg-slate-50 hover:shadow-[0_0_40px_rgba(255,255,255,0.7)]"
                onClick={() => scrollToSection('deca')}
              >
                {config.heroButtonPrimary || 'Learn More'}
              </Button>
            </div>
          </div>
        </section>

        <section id="deca" className="bg-white py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
                {config.aboutTitle || 'WHAT IS DECA?'}
              </h2>
              <p className="mt-4 text-xl text-slate-600">
                {config.aboutDescription || 'The best business competition there is out there.'}
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-3 max-w-5xl mx-auto mb-12">
              {[
                {
                  icon: Trophy,
                  title: 'Competition',
                  text: 'Demonstrate your business acumen in front of industry leaders and business pros.',
                },
                {
                  icon: Briefcase,
                  title: 'Networking',
                  text: 'Meet the experts, find new friends, explore leadership opportunities.',
                },
                {
                  icon: Globe,
                  title: 'Skills',
                  text: 'Develop presentation and speaking skills with an international perspective.',
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-[var(--template-primary)] text-white">
                    <item.icon className="h-16 w-16" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-[#E5F2FB] px-8 py-10 md:py-12 text-left">
              <h3 className="text-2xl font-bold text-slate-900 md:text-3xl mb-4">
                {config.missionTitle || 'Our Mission'}
              </h3>
              <p className="text-lg text-slate-900/90">
                {config.missionDescription ||
                  'We empower students to become academically prepared, community-oriented, professionally responsible, and experienced leaders through our comprehensive programs in marketing, finance, hospitality, and management.'}
              </p>
            </div>
          </div>
        </section>

        <section id="team" className="bg-white py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">Meet Our Executive Team</h2>
              <p className="mt-4 text-xl text-slate-600">
                Dedicated leaders working to make our chapter the best it can be
              </p>
            </div>

            {teamMembers.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
                Add your executive team to showcase chapter leadership.
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member, idx) => (
                  <Card key={`${member.name}-${idx}`} className="overflow-hidden border bg-white shadow transition-shadow hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[var(--template-primary)]/10 text-[var(--template-primary)]">
                        <Users className="h-16 w-16" />
                      </div>
                      <h3 className="text-xl font-bold text-center text-slate-900">{member.name}</h3>
                      <p className="mt-2 text-center text-sm font-semibold uppercase tracking-[0.15em] text-[var(--template-primary)]">
                        {member.role}
                      </p>
                      <p className="mt-3 text-center text-sm text-slate-600">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="success" className="bg-[#F8FAFC] py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">Our Success Stories</h2>
              <p className="mt-4 text-xl text-slate-600">
                Celebrating the achievements and excellence of our DECA members
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {achievements.map((achievement, idx) => (
                <Card
                  key={`${achievement.title}-${idx}`}
                  className="border bg-white transition-all duration-300 hover:shadow-xl"
                >
                  <CardContent className="flex gap-5 p-8">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[var(--template-primary)]/15 text-[var(--template-primary)]">
                      <achievement.icon className="h-8 w-8" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-bold text-slate-900">{achievement.title}</h3>
                        <span className="rounded-full bg-[var(--template-primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--template-primary)]">
                          {achievement.meta}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{achievement.details}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 rounded-xl border-2 border-[var(--template-primary)]/20 bg-[#E5F2FB] p-10 text-center">
              <h3 className="text-2xl font-bold text-slate-900">Ready to Add Your Name to Our Success Stories?</h3>
              <p className="mt-3 text-lg text-slate-600">
                Join us and discover your potential in the world of business!
              </p>
            </div>
          </div>
        </section>

        <section id="join" className="bg-[var(--template-primary)] py-20 text-white">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="text-4xl font-bold md:text-5xl">Join Our Chapter</h2>
              <p className="mt-4 text-xl text-white/85">
                Become part of a community that's shaping the future of business
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: MapPin, title: 'Location', lines: joinLocation },
                { icon: CalendarIcon, title: 'When', lines: joinSchedule },
                { icon: Users, title: 'Who Can Join', lines: ['All Students', 'No Experience Needed'] },
                { icon: Mail, title: 'Contact', lines: ['deca@yourschool.edu', '@yourchapter_deca'] },
              ].map((card) => (
                <Card key={card.title} className="border border-white/20 bg-white/10 text-center backdrop-blur">
                  <CardContent className="space-y-3 p-6">
                    <card.icon className="mx-auto h-12 w-12 text-white" />
                    <h3 className="text-lg font-semibold uppercase tracking-[0.15em]">{card.title}</h3>
                    {card.lines.map((line, idx) => (
                      <p key={idx} className="text-sm text-white/85">
                        {line}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 rounded-xl border-2 border-white/20 bg-white/10 p-8 md:p-10 backdrop-blur">
              <h3 className="text-3xl font-bold text-center mb-6">How to Join</h3>
              <div className="space-y-4 text-lg text-white/90">
                {[
                  'Attend any of our weekly meetings - no registration required!',
                  'Fill out a membership form and pay the annual dues ($25)',
                  'Start participating in meetings, competitions, and events!',
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-[var(--template-primary)] font-bold">
                      {index + 1}
                    </span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center text-white/90">
                <p className="text-xl font-semibold mb-2">Questions?</p>
                <p>Reach out to any executive member or email us at deca@yourschool.edu</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center">
            <Users className="h-12 w-12 text-[var(--template-primary)]" />
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Ready to elevate {config.clubName || 'our chapter'}?
            </h2>
            <p className="text-lg text-slate-600">
              {config.heroSubtitle ||
                'Bring your chapter online, connect members, and streamline competition season with a polished digital HQ.'}
            </p>
            <Button
              className="rounded-full bg-[var(--template-primary)] px-8 py-3 text-white transition hover:bg-[var(--template-primary-dark)]"
              onClick={() => scrollToSection('home')}
            >
              Back to top
            </Button>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-center text-slate-500 md:flex-row md:text-left">
            <div className="flex items-center gap-3 text-slate-700">
              <img src={LOGO_IMAGE} alt="DECA" className="h-10 w-10" />
              <div>
                <p className="font-semibold text-slate-900">{config.clubName || 'DECA Your Chapter'}</p>
                <p className="text-sm text-slate-500">{config.clubTagline || 'We Mean Business'}</p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              <p>© {new Date().getFullYear()} {config.clubName || 'DECA Your Chapter'}. All rights reserved.</p>
              <p className="text-xs">Preparing emerging leaders and entrepreneurs.</p>
            </div>
          </div>
        </section>
      </main>

      {faqs.length > 0 && (
        <section className="bg-white py-20">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Frequently Asked Questions</h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq, idx) => (
                <details key={`${faq.question}-${idx}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer text-lg font-semibold text-slate-900">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {galleryItems.length > 0 && (
        <section className="bg-white py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Gallery Highlights</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {galleryItems.map((item, idx) => (
                <span
                  key={`${item.title}-${idx}`}
                  className="rounded-full border border-[var(--template-primary)]/20 bg-[var(--template-primary)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--template-primary)]"
                >
                  {item.category}: {item.title}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DecaGlowTemplate;

