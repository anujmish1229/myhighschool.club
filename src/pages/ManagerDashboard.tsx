import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getManagedSchools } from '@/lib/managerUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle, XCircle, Clock, LogOut } from 'lucide-react';
import { getSchoolBySlug } from '@/data/ontarioSchools';
import RotatingEarth from '@/components/RotatingEarth';

interface Club {
  id: string;
  high_school_slug: string;
  club_slug: string;
  config: any;
  created_at: string;
  user_id: string;
  status: 'pending' | 'approved';
}

export default function ManagerDashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [managedSchools, setManagedSchools] = useState<string[]>([]);
  const [pendingClubs, setPendingClubs] = useState<Club[]>([]);
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingClubId, setProcessingClubId] = useState<string | null>(null);
  const [showAllClubs, setShowAllClubs] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.email) {
      loadManagerData();
    }
  }, [user]);

  const loadManagerData = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      // Get schools this user manages
      const schools = await getManagedSchools(user.email);
      setManagedSchools(schools);

      if (schools.length === 0) {
        toast.error('You are not a manager for any schools');
        setLoading(false);
        return;
      }

      // Get pending clubs for managed schools
      const { data: pendingData, error: pendingError } = await supabase
        .from('schools')
        .select('id, high_school_slug, club_slug, config, created_at, user_id, status')
        .in('high_school_slug', schools)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingClubs(pendingData || []);

      // Get all clubs for managed schools
      const { data: allData, error: allError } = await supabase
        .from('schools')
        .select('id, high_school_slug, club_slug, config, created_at, user_id, status')
        .in('high_school_slug', schools)
        .order('created_at', { ascending: false });

      if (allError) throw allError;
      setAllClubs(allData || []);
    } catch (error: any) {
      console.error('Error loading manager data:', error);
      toast.error('Failed to load manager data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (clubId: string) => {
    setProcessingClubId(clubId);
    try {
      const { error } = await supabase
        .from('schools')
        .update({ status: 'approved' })
        .eq('id', clubId);

      if (error) throw error;

      toast.success('Club approved successfully!');
      loadManagerData(); // Reload data
    } catch (error: any) {
      console.error('Error approving club:', error);
      toast.error('Failed to approve club: ' + error.message);
    } finally {
      setProcessingClubId(null);
    }
  };

  const handleReject = async (clubId: string, clubName: string) => {
    if (!confirm(`Are you sure you want to reject and delete "${clubName}"? This action cannot be undone.`)) {
      return;
    }

    setProcessingClubId(clubId);
    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', clubId);

      if (error) throw error;

      toast.success('Club rejected and removed');
      loadManagerData(); // Reload data
    } catch (error: any) {
      console.error('Error rejecting club:', error);
      toast.error('Failed to reject club: ' + error.message);
    } finally {
      setProcessingClubId(null);
    }
  };

  const handleDeleteClub = async (clubId: string, clubName: string) => {
    if (!confirm(`Are you sure you want to delete "${clubName}"? This action cannot be undone.`)) {
      return;
    }

    setProcessingClubId(clubId);
    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', clubId);

      if (error) throw error;

      toast.success('Club deleted successfully');
      loadManagerData(); // Reload data
    } catch (error: any) {
      console.error('Error deleting club:', error);
      toast.error('Failed to delete club: ' + error.message);
    } finally {
      setProcessingClubId(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const Background = () => (
    <>
      <div className="absolute inset-0 opacity-10">
        <RotatingEarth />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-[22rem] w-[22rem] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      </div>
    </>
  );

  if (authLoading || loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-16">
        <Background />
        <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground/90">Loading manager dashboard…</p>
          </div>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-[pulse_1.6s_ease-in-out_infinite] rounded-full bg-primary/60" />
          </div>
        </div>
      </div>
    );
  }

  if (managedSchools.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-16">
        <Background />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-auto flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Not a Manager</h1>
            <p className="mt-4 text-sm text-foreground/60">
              You are not currently assigned as a manager for any schools. Contact the administrator to get manager access.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Go to Dashboard
            </Button>
            <Button onClick={handleSignOut} variant="ghost">
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-16 sm:px-6">
      <Background />

      <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col gap-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-background/60 p-8 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Manager Dashboard</h1>
              <p className="text-sm text-foreground/60">Signed in as {user?.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 text-sm text-foreground/60 md:flex-row md:items-center">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              My Clubs
            </Button>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground/70 hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </motion.header>

        {/* Managed Schools Info */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-background/60 p-6 shadow-2xl backdrop-blur-xl"
        >
          <h2 className="mb-4 text-xl font-semibold text-foreground/90">Schools You Manage</h2>
          <div className="flex flex-wrap gap-2">
            {managedSchools.map((slug) => {
              const school = getSchoolBySlug(slug);
              return (
                <Badge key={slug} variant="secondary" className="px-3 py-1">
                  {school?.name || slug}
                </Badge>
              );
            })}
          </div>
        </motion.section>

        {/* Pending Clubs */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-background/60 shadow-2xl backdrop-blur-xl"
        >
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gradient">Pending Approvals</h2>
                <p className="mt-1 text-sm text-foreground/60">
                  Review and approve clubs for your schools
                </p>
              </div>
              <Badge variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {pendingClubs.length} pending
              </Badge>
            </div>
          </div>

          <div className="p-6">
            {pendingClubs.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500/50" />
                <h3 className="text-xl font-semibold text-foreground/80">All caught up!</h3>
                <p className="mt-2 text-sm text-foreground/60">
                  No pending clubs to review at the moment.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingClubs.map((club) => {
                  const school = getSchoolBySlug(club.high_school_slug);
                  const isProcessing = processingClubId === club.id;
                  
                  return (
                    <Card key={club.id} className="border-white/10 bg-white/5">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {club.config.clubName || club.club_slug}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {school?.name || club.high_school_slug}
                            </CardDescription>
                            <p className="mt-2 text-xs text-foreground/50">
                              Created {new Date(club.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <p className="text-sm text-foreground/70">
                            <span className="font-medium">Tagline:</span> {club.config.clubTagline || 'N/A'}
                          </p>
                          <p className="mt-1 text-sm text-foreground/70">
                            <span className="font-medium">URL:</span> /{club.high_school_slug}/{club.club_slug}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApprove(club.id)}
                            disabled={isProcessing}
                            className="flex items-center gap-2"
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4" />
                            {isProcessing ? 'Approving...' : 'Approve'}
                          </Button>
                          <Button
                            onClick={() => handleReject(club.id, club.config.clubName || club.club_slug)}
                            disabled={isProcessing}
                            variant="destructive"
                            className="flex items-center gap-2"
                            size="sm"
                          >
                            <XCircle className="h-4 w-4" />
                            {isProcessing ? 'Rejecting...' : 'Reject'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>

        {/* All Clubs Management */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-background/60 shadow-2xl backdrop-blur-xl"
        >
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gradient">All Clubs</h2>
                <p className="mt-1 text-sm text-foreground/60">
                  Manage all clubs for your schools
                </p>
              </div>
              <Badge variant="outline" className="flex items-center gap-2">
                {allClubs.length} total
              </Badge>
            </div>
          </div>

          <div className="p-6">
            {allClubs.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-foreground/60">
                  No clubs found for your schools.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {allClubs.map((club) => {
                  const school = getSchoolBySlug(club.high_school_slug);
                  const isProcessing = processingClubId === club.id;
                  
                  return (
                    <Card key={club.id} className="border-white/10 bg-white/5">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {club.config.clubName || club.club_slug}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {school?.name || club.high_school_slug}
                            </CardDescription>
                            <p className="mt-2 text-xs text-foreground/50">
                              Created {new Date(club.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {club.status === 'pending' ? (
                            <Badge variant="outline" className="flex items-center gap-1 border-yellow-500/50 bg-yellow-500/10 text-yellow-500">
                              <Clock className="h-3 w-3" />
                              Pending
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1 border-green-500/50 bg-green-500/10 text-green-500">
                              <CheckCircle className="h-3 w-3" />
                              Approved
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <p className="text-sm text-foreground/70">
                            <span className="font-medium">Tagline:</span> {club.config.clubTagline || 'N/A'}
                          </p>
                          <p className="mt-1 text-sm text-foreground/70">
                            <span className="font-medium">URL:</span> /{club.high_school_slug}/{club.club_slug}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleDeleteClub(club.id, club.config.clubName || club.club_slug)}
                            disabled={isProcessing}
                            variant="destructive"
                            className="flex items-center gap-2"
                            size="sm"
                          >
                            <XCircle className="h-4 w-4" />
                            {isProcessing ? 'Deleting...' : 'Delete Club'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

