import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { supabase } from '@/lib/supabase';
import Setup from './Setup';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditSchool() {
  const { schoolSlug, clubSlug } = useParams<{ schoolSlug: string; clubSlug: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { loadSchoolConfig, loading: configLoading, schoolId } = useConfig();
  const [isOwner, setIsOwner] = useState(false);
  const [checking, setChecking] = useState(true);

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

  if (authLoading || configLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!isOwner) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <Setup isEditMode={true} schoolId={schoolId} />
      </div>
    </div>
  );
}

