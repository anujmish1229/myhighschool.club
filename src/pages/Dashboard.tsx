import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PlusCircle, Globe, Settings, LogOut, ExternalLink } from 'lucide-react';
import { ontarioSchools, searchSchools } from '@/data/ontarioSchools';
import type { School as HighSchool } from '@/data/ontarioSchools';

interface School {
  id: string;
  high_school_slug: string;
  club_slug: string;
  template_id: string;
  config: any;
  created_at: string;
  updated_at: string;
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
    }
  }, [user]);

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

      const { data, error } = await supabase
        .from('schools')
        .insert([
          {
            user_id: user?.id,
            high_school_slug: selectedHighSchool.slug,
            club_slug: newClubSlug.toLowerCase(),
            template_id: selectedTemplate,
            config: template.default_config,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Club website created successfully!');
      setSchools([data, ...schools]);
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="animate-pulse text-lg">Loading dashboard...</p>
          <p className="text-sm text-muted-foreground">
            {authLoading ? 'Verifying authentication...' : 'Fetching your clubs...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.email}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Create New Club Button */}
        {!showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              onClick={() => setShowCreateForm(true)}
              size="lg"
              className="w-full sm:w-auto"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Club Website
            </Button>
          </motion.div>
        )}

        {/* Create Club Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Create New Club Website</CardTitle>
                <CardDescription>
                  Choose a template and set your club's URL slug
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateSchool}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="highschool">Select High School</Label>
                    <div className="relative">
                      <Input
                        id="highschool"
                        placeholder="Search for your high school..."
                        value={selectedHighSchool ? selectedHighSchool.name : schoolSearchQuery}
                        onChange={(e) => {
                          setSchoolSearchQuery(e.target.value);
                          setSelectedHighSchool(null);
                          setShowSchoolDropdown(true);
                        }}
                        onFocus={() => setShowSchoolDropdown(true)}
                        required
                      />
                      {showSchoolDropdown && !selectedHighSchool && (
                        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredSchools.length > 0 ? (
                            filteredSchools.map((school) => (
                              <button
                                key={school.id}
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                                onClick={() => {
                                  setSelectedHighSchool(school);
                                  setSchoolSearchQuery(school.name);
                                  setShowSchoolDropdown(false);
                                }}
                              >
                                <div className="font-medium">{school.name}</div>
                                <div className="text-xs text-muted-foreground">{school.city}, Ontario</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-muted-foreground">
                              No schools found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedHighSchool && (
                      <p className="text-sm text-green-600">
                        ✓ Selected: {selectedHighSchool.name}, {selectedHighSchool.city}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clubslug">Club URL Slug</Label>
                    {selectedHighSchool && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          myhighschool.club/{selectedHighSchool.slug}/
                        </span>
                        <Input
                          id="clubslug"
                          placeholder="robotics-club"
                          value={newClubSlug}
                          onChange={(e) => setNewClubSlug(e.target.value.toLowerCase())}
                          required
                        />
                      </div>
                    )}
                    {!selectedHighSchool && (
                      <Input
                        id="clubslug"
                        placeholder="Select a school first"
                        disabled
                      />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Use lowercase letters, numbers, and hyphens only
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template">Choose Template</Label>
                    <div className="grid grid-cols-1 gap-4">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedTemplate === template.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="template"
                              value={template.id}
                              checked={selectedTemplate === template.id}
                              onChange={(e) => setSelectedTemplate(e.target.value)}
                              className="mt-1"
                            />
                            <div>
                              <h3 className="font-semibold">{template.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button type="submit" disabled={creating}>
                    {creating ? 'Creating...' : 'Create Club'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school, index) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    {school.config.clubName || school.club_slug}
                  </CardTitle>
                  <CardDescription>
                    {ontarioSchools.find(s => s.slug === school.high_school_slug)?.name || school.high_school_slug}
                  </CardDescription>
                  <CardDescription className="text-xs">
                    myhighschool.club/{school.high_school_slug}/{school.club_slug}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(school.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(`/${school.high_school_slug}/${school.club_slug}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/edit/${school.high_school_slug}/${school.club_slug}`)}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {schools.length === 0 && !showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Globe className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No club websites yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first club website to get started
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

