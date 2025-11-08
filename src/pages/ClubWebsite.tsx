import { useEffect, useState } from 'react';
import { useParams, Routes, Route, Navigate } from 'react-router-dom';
import { useConfig } from '@/context/ConfigContext';
import { getSchoolBySlug } from '@/data/ontarioSchools';
import ClubHome from './ClubHome';
import About from './About';
import Team from './Team';
import Gallery from './Gallery';
import FAQ from './FAQ';
import Announcements from './Announcements';
import NotFound from './NotFound';

export default function ClubWebsite() {
  const { schoolSlug, clubSlug } = useParams<{ schoolSlug: string; clubSlug: string }>();
  const { loadSchoolConfig, loading, isConfigured } = useConfig();
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const highSchool = schoolSlug ? getSchoolBySlug(schoolSlug) : undefined;

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 light-theme bg-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-lg text-gray-700">Loading club website...</p>
          <p className="text-sm text-gray-600">{schoolSlug}/{clubSlug}</p>
        </div>
      </div>
    );
  }

  if (!highSchool) {
    return (
      <div className="min-h-screen flex items-center justify-center light-theme bg-white text-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">High School Not Found</h1>
          <p className="text-gray-700">The high school "{schoolSlug}" is not in our directory.</p>
        </div>
      </div>
    );
  }

  if (notFound || !isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center light-theme bg-white text-gray-900">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Club Not Found</h1>
          <p className="text-gray-700 mb-4">
            We couldn't find the club "{clubSlug}" at {highSchool.name}.
          </p>
          {loadError && (
            <p className="text-sm text-red-600 mb-4">Error: {loadError}</p>
          )}
          <p className="text-sm text-gray-600">
            If you just created this club, make sure you completed the setup wizard.
          </p>
        </div>
      </div>
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

