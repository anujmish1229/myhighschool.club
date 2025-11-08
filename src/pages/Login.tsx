import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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

  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="animate-pulse text-lg">
            {isRedirecting ? 'Redirecting to dashboard...' : 'Loading...'}
          </p>
          {showRetry && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Taking longer than expected?</p>
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
              >
                Go to Dashboard Manually
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MyHighSchool.Club
            </CardTitle>
            <CardDescription className="text-base">
              Create beautiful school club websites in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Sign in to create and manage your club website
              </p>
              <Button
                onClick={handleGoogleLogin}
                className="w-full"
                size="lg"
                variant="default"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
            <div className="pt-4 border-t">
              <div className="text-xs text-muted-foreground text-center space-y-2">
                <p>✓ No credit card required</p>
                <p>✓ Create unlimited club websites</p>
                <p>✓ Choose from beautiful templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

