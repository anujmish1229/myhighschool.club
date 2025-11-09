import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import RotatingEarth from '@/components/RotatingEarth';
import { ArrowLeft, GoogleLogo, ShieldCheck } from 'phosphor-react';

export default function Login() {
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      console.log('✅ User authenticated, redirecting to dashboard...');
      setIsRedirecting(true);
      
      // Small delay to ensure everything is ready
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    }
  }, [user, loading, navigate]);

  // Show retry button if stuck loading for too long
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowRetry(true);
      }, 5000); // Show retry after 5 seconds
      
      return () => clearTimeout(timer);
    } else {
      setShowRetry(false);
    }
  }, [loading]);

  const handleGoogleLogin = async () => {
    try {
      console.log('🔐 Initiating Google login...');
      await signInWithGoogle();
      toast.success('Redirecting to Google sign-in...');
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('Failed to initiate login. Please try again.');
    }
  };

  const Background = () => (
    <>
      <div className="absolute inset-0 opacity-15">
        <RotatingEarth />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute top-1/3 right-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>
    </>
  );

  const BackButton = () => (
    <Button
      onClick={() => navigate('/')}
      variant="ghost"
      className="absolute top-6 left-6 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-background/60 px-5 py-2 text-sm text-foreground/80 hover:bg-background/80"
    >
      <ArrowLeft size={18} weight="bold" />
      <span>Back to homepage</span>
    </Button>
  );

  if (loading || isRedirecting) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-24">
        <Background />
        <BackButton />
        <div className="relative z-20 glass rounded-3xl px-10 py-12 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <ShieldCheck size={28} weight="duotone" />
          </div>
          <p className="text-lg font-semibold text-foreground/90 mb-2">
            {isRedirecting ? 'Redirecting to dashboard…' : 'Preparing your workspace'}
          </p>
          <p className="text-sm text-foreground/60 mb-6">
            {showRetry ? 'This is taking longer than usual. You can jump ahead manually.' : 'One moment while we verify your credentials.'}
          </p>
          <div className="mx-auto mb-6 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-primary/60" />
          </div>
          {showRetry && (
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="mx-auto flex items-center gap-2"
            >
              Go to dashboard
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-24">
      <Background />
      <BackButton />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 w-full max-w-xl"
      >
        <Card className="glass border border-white/10 bg-background/60 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-4">
              <img src="/logo.png" alt="myhighschool.club" className="h-12 w-12 rounded-2xl shadow-xl" />
              <div className="text-left">
                <CardTitle className="text-3xl font-bold text-gradient">myhighschool.club</CardTitle>
                <CardDescription className="text-base text-foreground/70">
                  Premium digital homes for every high-school club
                </CardDescription>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 text-sm text-foreground/70 md:grid-cols-2">
              <div className="glass rounded-xl px-4 py-3 text-left">
                <p className="font-medium text-foreground/90">Why join?</p>
                <p>Launch stunning club sites in minutes with AI-crafted content.</p>
              </div>
              <div className="glass rounded-xl px-4 py-3 text-left">
                <p className="font-medium text-foreground/90">Stay secure</p>
                <p>Single-sign-on with Google keeps your club data protected.</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center text-sm text-foreground/70">
              Sign in with your school Google account to manage clubs and events.
            </div>

            <Button
              onClick={handleGoogleLogin}
              size="lg"
              className="w-full neumorphic glow bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/40"
            >
              <GoogleLogo size={22} weight="fill" className="mr-2" />
              Continue with Google
            </Button>

            <div className="grid grid-cols-1 gap-3 text-xs text-foreground/60 md:grid-cols-3">
              <div className="glass rounded-lg px-3 py-2">✓ No credit card required</div>
              <div className="glass rounded-lg px-3 py-2">✓ Unlimited club sites</div>
              <div className="glass rounded-lg px-3 py-2">✓ Built-in announcements</div>
            </div>

            <p className="text-center text-xs text-foreground/50">
              Need access? Contact your school administrator or email hello@myhighschool.club
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

