import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'phosphor-react';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { supabase } from '@/lib/supabase';
import Settings from './Settings';
import Setup from './Setup';
import { Button } from '@/components/ui/button';

interface EditSchoolProps {
  isSetup?: boolean;
}

export default function EditSchool({ isSetup = false }: EditSchoolProps) {
  const { schoolSlug, clubSlug } = useParams<{ schoolSlug: string; clubSlug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { loadSchoolConfig, loading: configLoading, schoolId } = useConfig();
  const [isOwner, setIsOwner] = useState(false);
  const [checking, setChecking] = useState(true);
  
  // Determine if we're in setup mode based on route or prop
  const isSetupMode = isSetup || location.pathname.includes('/setup/');

  useEffect(() => {
    let isMounted = true;
    
    const checkOwnership = async () => {
      if (!isMounted) return;
      
      if (!user || !schoolSlug || !clubSlug) {
        navigate('/login');
        return;
      }

      // Load the school config
      const success = await loadSchoolConfig(`${schoolSlug}/${clubSlug}`);
      if (!isMounted) return;
      
      if (!success) {
        navigate('/dashboard');
        return;
      }

      // Check if the user owns this school
      const { data, error } = await supabase
        .from('schools')
        .select('user_id')
        .eq('high_school_slug', schoolSlug)
        .eq('club_slug', clubSlug)
        .single();

      if (!isMounted) return;
      
      if (error || !data || data.user_id !== user.id) {
        navigate('/dashboard');
        return;
      }

      setIsOwner(true);
      setChecking(false);
    };

    if (!authLoading) {
      checkOwnership();
    }
    
    return () => {
      isMounted = false;
    };
  }, [user, schoolSlug, clubSlug, authLoading, loadSchoolConfig, navigate]);

  const Background = () => (
    <>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 120% at 0% 100%, rgba(11,19,32,0.85) 0%, rgba(11,19,32,0.6) 45%, rgba(11,19,32,0) 100%)' }} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
      </div>
    </>
  );

  if (authLoading || configLoading || checking) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#070c16] px-6 py-24">
        <Background />
        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <ShieldCheck size={28} weight="duotone" />
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground/90">Loading editor…</p>
            <p className="mt-2 text-sm text-foreground/60">We’re fetching your club configuration.</p>
          </div>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-[pulse_1.6s_ease-in-out_infinite] rounded-full bg-primary/60" />
          </div>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070c16] px-4 py-16 sm:px-6">
      <Background />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className="glass flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-foreground/80 shadow-lg backdrop-blur hover:bg-white/20 hover:text-foreground"
        >
          <ArrowLeft size={18} weight="bold" />
          Back to dashboard
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {isSetupMode ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-50px_rgba(59,130,246,0.7)] backdrop-blur-xl sm:p-10">
              <Setup schoolId={schoolId} />
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-50px_rgba(59,130,246,0.7)] backdrop-blur-xl sm:p-10">
              <Settings schoolId={schoolId} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

