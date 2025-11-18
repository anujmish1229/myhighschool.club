import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PlusCircle, Globe, Settings, LogOut, ExternalLink, Clock, CheckCircle } from 'lucide-react';
import { Notebook, Lightning, UsersThree, ShieldCheck, ArrowRight } from 'phosphor-react';
import RotatingEarth from '@/components/RotatingEarth';
import { ontarioSchools, searchSchools } from '@/data/ontarioSchools';
import type { School as HighSchool } from '@/data/ontarioSchools';
import { isManager } from '@/lib/managerUtils';

interface School {
  id: string;
  high_school_slug: string;
  club_slug: string;
  template_id: string;
  config: any;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved';
}

interface Template {
  id: string;
  name: string;
  description: string;
  preview_image?: string;
  default_config: any;
}

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClubSlug, setNewClubSlug] = useState('');
  const [selectedHighSchool, setSelectedHighSchool] = useState<HighSchool | null>(null);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [creating, setCreating] = useState(false);
  const [userIsManager, setUserIsManager] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('⚠️ No user found, redirecting to login...');
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      console.log('👤 User authenticated:', user.email);
      fetchSchools();
      fetchTemplates();
      checkManagerStatus();
    }
  }, [user]);

  const checkManagerStatus = async () => {
    if (user?.email) {
      const managerStatus = await isManager(user.email);
      setUserIsManager(managerStatus);
    }
  };

  const fetchSchools = async () => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchools(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch schools: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
      if (data && data.length > 0) {
        setSelectedTemplate(data[0].id);
      }
    } catch (error: any) {
      toast.error('Failed to fetch templates: ' + error.message);
    }
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHighSchool) {
      toast.error('Please select a high school');
      return;
    }

    if (!newClubSlug.trim()) {
      toast.error('Please enter a club slug');
      return;
    }

    // Validate slug format (alphanumeric and hyphens only)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(newClubSlug)) {
      toast.error('Slug can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    setCreating(true);

    try {
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) {
        throw new Error('Template not found');
      }

      // Create the entry with default config (will be updated during setup)
      const { data, error } = await supabase
        .from('schools')
        .insert([
          {
            user_id: user?.id,
            high_school_slug: selectedHighSchool.slug,
            club_slug: newClubSlug.toLowerCase(),
            template_id: selectedTemplate,
            config: template.default_config,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Redirect to setup to configure the website
      navigate(`/setup/${selectedHighSchool.slug}/${newClubSlug.toLowerCase()}`);
      
      setShowCreateForm(false);
      setNewClubSlug('');
      setSelectedHighSchool(null);
      setSchoolSearchQuery('');
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('This club already exists at this school. Please choose another name.');
      } else {
        toast.error('Failed to create club: ' + error.message);
      }
    } finally {
      setCreating(false);
    }
  };

  const filteredSchools = schoolSearchQuery ? searchSchools(schoolSearchQuery) : ontarioSchools;

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

  const LoadingState = () => (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-24">
      <Background />
      <div className="relative z-20 mx-auto flex max-w-md flex-col items-center gap-6 rounded-3xl border border-white/10 bg-background/60 p-10 text-center shadow-2xl backdrop-blur-xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
          <ShieldCheck size={28} weight="duotone" />
        </div>
        <div>
          <p className="text-xl font-semibold text-foreground/90">Loading dashboard…</p>
          <p className="mt-2 text-sm text-foreground/60">
            {authLoading ? 'Verifying authentication…' : 'Fetching your club workspaces…'}
          </p>
        </div>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-[pulse_1.6s_ease-in-out_infinite] rounded-full bg-primary/60" />
        </div>
      </div>
    </div>
  );

  if (authLoading || loading) {
    return <LoadingState />;
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
          <div className="flex items-center gap-4" onClick={() => navigate('../')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="myhighschool.club" className="h-12 w-12 rounded-2xl shadow-xl" />
            <div>
              <h1 className="text-3xl font-bold text-gradient">Club Command Center</h1>
              <p className="text-sm text-foreground/60">Signed in as {user?.email}</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 text-sm text-foreground/60 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <UsersThree size={20} weight="duotone" />
              </div>
              <div>
                <p className="font-medium text-foreground/80">{schools.length} active clubs</p>
                <p>Bring your school community online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {userIsManager && (
                <Button
                  onClick={() => navigate('/manager-dashboard')}
                  variant="outline"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                >
                  <ShieldCheck size={16} weight="duotone" />
                  Manager Dashboard
                </Button>
              )}
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground/70 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid gap-4 md:grid-cols-1"
        >
          <button
            onClick={() => setShowCreateForm(true)}
            className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-[0_30px_80px_-40px_rgba(15,118,255,0.5)] transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-white/10 hover:shadow-[0_40px_100px_-40px_rgba(59,130,246,0.65)]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-colors group-hover:bg-primary/25 group-hover:text-primary/90">
                <Notebook size={24} weight="duotone" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground/90">Launch a club website</h2>
                <p className="mt-2 text-sm text-foreground/60">
                  Spin up a new site with AI-assisted defaults tuned for your school.
                </p>
              </div>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:translate-x-1 group-hover:text-primary/80">
              Create club
              <ArrowRight size={16} weight="bold" />
            </span>
          </button>
        </motion.section>

        {/* Create Form */}
        {showCreateForm && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-background/70 shadow-2xl backdrop-blur-xl"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader className="gap-4 border-b border-white/10">
                <CardTitle className="text-2xl text-gradient">Launch a new club site</CardTitle>
                <CardDescription className="text-sm text-foreground/60">
                  Select your school, choose a template, and set the public URL your students will use.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateSchool}>
                <CardContent className="grid gap-6 py-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="highschool" className="text-foreground/80">Select high school</Label>
                    <div className="relative">
                      <Input
                        id="highschool"
                        placeholder="Start typing your school name…"
                        value={selectedHighSchool ? selectedHighSchool.name : schoolSearchQuery}
                        onChange={(e) => {
                          setSchoolSearchQuery(e.target.value);
                          setSelectedHighSchool(null);
                          setShowSchoolDropdown(true);
                        }}
                        onFocus={() => setShowSchoolDropdown(true)}
                        required
                        className="bg-white/5"
                      />
                      {showSchoolDropdown && !selectedHighSchool && (
                        <div className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-background/95 shadow-xl backdrop-blur">
                          {filteredSchools.length > 0 ? (
                            filteredSchools.map((school) => (
                              <button
                                key={school.id}
                                type="button"
                                className="w-full px-4 py-3 text-left text-sm text-foreground/80 hover:bg-white/10"
                                onClick={() => {
                                  setSelectedHighSchool(school);
                                  setSchoolSearchQuery(school.name);
                                  setShowSchoolDropdown(false);
                                }}
                              >
                                <div className="font-medium text-foreground/90">{school.name}</div>
                                <div className="text-xs text-foreground/60">{school.city}, Ontario</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-foreground/50">No schools found</div>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedHighSchool && (
                      <p className="text-xs font-medium text-emerald-400">
                        ✓ Selected {selectedHighSchool.name} • {selectedHighSchool.city}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="clubslug" className="text-foreground/80">Club URL slug</Label>
                    {selectedHighSchool ? (
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground/70">
                        <span>myhighschool.club/{selectedHighSchool.slug}/</span>
                        <Input
                          id="clubslug"
                          placeholder="robotics-club"
                          value={newClubSlug}
                          onChange={(e) => setNewClubSlug(e.target.value.toLowerCase())}
                          required
                          className="border-none bg-transparent px-0 text-foreground/90 focus-visible:ring-0"
                        />
                      </div>
                    ) : (
                      <Input id="clubslug" placeholder="Select a school first" disabled className="bg-white/5" />
                    )}
                    <p className="text-xs text-foreground/50">Lowercase letters, numbers, and hyphens only.</p>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <Label className="text-foreground/80">Template</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                            selectedTemplate === template.id
                              ? 'border-primary bg-primary/10 shadow-[0_20px_60px_-30px_rgba(59,130,246,0.7)]'
                              : 'border-white/10 bg-white/5 hover:border-primary/40'
                          }`}
                        >
                          <input
                            type="radio"
                            name="template"
                            value={template.id}
                            checked={selectedTemplate === template.id}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-semibold text-foreground/90">{template.name}</p>
                            <p className="text-sm text-foreground/60">{template.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 border-t border-white/10 py-6 sm:flex-row">
                  <Button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {creating ? 'Creating…' : 'Create club site'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 border border-white/10 bg-white/5 text-foreground/70 hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.section>
        )}

        {/* Clubs Grid */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showCreateForm ? 0.2 : 0.12, duration: 0.6 }}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {schools.map((school, index) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-white/10 bg-background/60 shadow-[0_30px_80px_-50px_rgba(59,130,246,0.8)] backdrop-blur-xl"
            >
              <Card className="border-0 bg-transparent p-0 shadow-none">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-lg text-foreground/90">
                      <Globe className="h-5 w-5 text-primary" />
                      {school.config.clubName || school.club_slug}
                    </CardTitle>
                    {school.status === 'pending' ? (
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
                  <CardDescription className="text-sm text-foreground/60">
                    {ontarioSchools.find((s) => s.slug === school.high_school_slug)?.name || school.high_school_slug}
                  </CardDescription>
                  <CardDescription className="text-xs text-foreground/50">
                    myhighschool.club/{school.high_school_slug}/{school.club_slug}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-foreground/60">
                  <p>Created {new Date(school.created_at).toLocaleDateString()}</p>
                  <p>Last updated {new Date(school.updated_at).toLocaleDateString()}</p>
                </CardContent>
                <CardFooter className="flex gap-3 border-t border-white/10 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 border border-white/10 bg-white/5 text-foreground/70 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => window.open(`/${school.high_school_slug}/${school.club_slug}`, '_blank')}
                    disabled={school.status === 'pending'}
                    title={school.status === 'pending' ? 'Club must be approved before viewing' : 'View site'}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View site
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => navigate(`/edit/${school.high_school_slug}/${school.club_slug}`)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* Empty State */}
        {schools.length === 0 && !showCreateForm && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col items-center gap-6 rounded-3xl border border-dashed border-primary/30 bg-white/5 p-12 text-center text-foreground/70"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Globe className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground/90">No club sites yet</h2>
              <p className="mt-2 text-sm text-foreground/60">
                Launch your first club destination — it only takes a minute.
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create a club website
            </Button>
          </motion.section>
        )}
      </div>
    </div>
  );
}

