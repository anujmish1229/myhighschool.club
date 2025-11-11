import { useEffect, useState } from 'react';
import { useParams, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useConfig } from '@/context/ConfigContext';
import { getSchoolBySlug } from '@/data/ontarioSchools';
import ClubHome from './ClubHome';
import About from './About';
import Team from './Team';
import Gallery from './Gallery';
import FAQ from './FAQ';
import Announcements from './Announcements';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Compass, ArrowLeft, ShieldCheck } from 'phosphor-react';
import DecaGlowTemplate from '@/templates/DecaGlowTemplate';

export default function ClubWebsite() {
  const { schoolSlug, clubSlug } = useParams<{ schoolSlug: string; clubSlug: string }>();
  const { loadSchoolConfig, loading, isConfigured, templateName } = useConfig();
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const navigate = useNavigate();

  const highSchool = schoolSlug ? getSchoolBySlug(schoolSlug) : undefined;

  const Background = () => (
    <>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 120% at 10% 90%, rgba(11,19,32,0.85) 0%, rgba(11,19,32,0.6) 45%, rgba(11,19,32,0) 100%)' }} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-16 left-8 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      </div>
    </>
  );

  useEffect(() => {
    let isMounted = true; // Prevent updates if component unmounts
    
    const loadConfig = async () => {
      if (schoolSlug && clubSlug && isMounted) {
        console.log(`🔍 Loading club: ${schoolSlug}/${clubSlug}`);
        try {
          const success = await loadSchoolConfig(`${schoolSlug}/${clubSlug}`);
          if (!isMounted) return; // Don't update if unmounted
          
          if (!success) {
            console.log('❌ Club not found in database');
            setNotFound(true);
          } else {
            console.log('✅ Club loaded successfully');
          }
        } catch (error) {
          if (!isMounted) return;
          console.error('❌ Error loading club:', error);
          setLoadError(error instanceof Error ? error.message : 'Unknown error');
          setNotFound(true);
        }
      }
    };
    
    loadConfig();
    
    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [schoolSlug, clubSlug, loadSchoolConfig]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#070c16] px-6 py-24">
        <Background />
        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <ShieldCheck size={28} weight="duotone" />
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground/90">Loading club workspace…</p>
            <p className="mt-2 text-sm text-foreground/60">{schoolSlug}/{clubSlug}</p>
          </div>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-[pulse_1.6s_ease-in-out_infinite] rounded-full bg-primary/60" />
          </div>
        </div>
      </div>
    );
  }

  if (!highSchool) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#070c16] px-6 py-24">
        <Background />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-[0_40px_140px_-70px_rgba(59,130,246,0.8)] backdrop-blur-xl"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <Compass size={28} weight="duotone" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gradient">High school not found</h1>
            <p className="text-sm text-foreground/60">
              The high school "{schoolSlug}" isn’t in our directory yet. Head back to the homepage to explore other schools.
            </p>
          </div>
          <Button
            onClick={() => navigate('/')}
            className="glass flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-foreground/80 shadow-lg backdrop-blur hover:bg-white/20 hover:text-foreground"
          >
            <ArrowLeft size={18} weight="bold" />
            Return to homepage
          </Button>
        </motion.div>
      </div>
    );
  }

  if (notFound || !isConfigured) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#070c16] px-4 py-16 sm:px-6">
        <Background />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-[0_40px_140px_-70px_rgba(59,130,246,0.8)] backdrop-blur-xl"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <Compass size={28} weight="duotone" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gradient">Club not found</h1>
            <p className="text-sm text-foreground/60">
              We couldn’t find the club "{clubSlug}" at {highSchool.name}. It might have been removed or hasn’t been set up yet.
            </p>
            {loadError && (
              <p className="text-xs text-red-400">Error: {loadError}</p>
            )}
            <p className="text-xs text-foreground/50">
              If you just created this club, finish the setup wizard or contact your administrator for access.
            </p>
          </div>
          <Button
            onClick={() => navigate('/')}
            className="glass flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-foreground/80 shadow-lg backdrop-blur hover:bg-white/20 hover:text-foreground"
          >
            <ArrowLeft size={18} weight="bold" />
            Back to homepage
          </Button>
        </motion.div>
      </div>
    );
  }

  if (templateName === 'DECA Glow Template') {
    return (
      <Routes>
        <Route path="/" element={<DecaGlowTemplate />} />
        <Route path="*" element={<Navigate to={`/${schoolSlug}/${clubSlug}`} replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<ClubHome />} />
      <Route path="/about" element={<About />} />
      <Route path="/team" element={<Team />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="*" element={<Navigate to={`/${schoolSlug}/${clubSlug}`} replace />} />
    </Routes>
  );
}

