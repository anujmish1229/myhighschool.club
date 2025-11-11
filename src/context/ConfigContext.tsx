import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { WebsiteConfig, defaultConfig } from '@/types/config';
import { supabase } from '@/lib/supabase';

interface ConfigContextType {
  config: WebsiteConfig;
  updateConfig: (newConfig: WebsiteConfig, schoolId?: string) => Promise<void>;
  isConfigured: boolean;
  schoolSlug?: string;
  schoolId?: string;
  loading: boolean;
  templateId?: string;
  templateName?: string;
  loadSchoolConfig: (slug: string) => Promise<boolean>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<WebsiteConfig>(defaultConfig);
  const [isConfigured, setIsConfigured] = useState(false);
  const [schoolSlug, setSchoolSlug] = useState<string | undefined>();
  const [schoolId, setSchoolId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [templateId, setTemplateId] = useState<string | undefined>();
  const [templateName, setTemplateName] = useState<string | undefined>();

  const loadSchoolConfig = useCallback(async (slug: string): Promise<boolean> => {
    setLoading(true);
    setTemplateId(undefined);
    setTemplateName(undefined);
    try {
      // slug can be either "school-slug/club-slug" or just "club-slug" (for backwards compatibility)
      const slugParts = slug.split('/');
      let query = supabase.from('schools').select('id, config, high_school_slug, club_slug, template_id');
      
      if (slugParts.length === 2) {
        // New format: school-slug/club-slug
        query = query.eq('high_school_slug', slugParts[0]).eq('club_slug', slugParts[1]);
      } else {
        // Old format or just club slug (backwards compatibility)
        query = query.eq('club_slug', slug);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error('Error loading school config:', error);
        setLoading(false);
        return false;
      }

      if (data) {
        setConfig(data.config);
        setSchoolSlug(`${data.high_school_slug}/${data.club_slug}`);
        setSchoolId(data.id);
        setTemplateId(data.template_id);

        if (data.template_id) {
          try {
            const { data: templateData, error: templateError } = await supabase
              .from('templates')
              .select('name')
              .eq('id', data.template_id)
              .single();

            if (templateError) {
              console.error('Error loading template metadata:', templateError);
            }

            setTemplateName(templateData?.name);
          } catch (templateLookupError) {
            console.error('Unexpected error loading template metadata:', templateLookupError);
          }
        } else {
          setTemplateName(undefined);
        }

        setIsConfigured(true);
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Error loading school config:', error);
      setLoading(false);
      return false;
    }
  }, []); // Empty deps - this function never needs to change

  const updateConfig = useCallback(async (newConfig: WebsiteConfig, schoolIdParam?: string) => {
    setConfig(newConfig);
    
    // If we have a school ID (either from param or state), update in Supabase
    const idToUpdate = schoolIdParam || schoolId;
    if (idToUpdate) {
      try {
        const { error } = await supabase
          .from('schools')
          .update({ 
            config: newConfig,
            updated_at: new Date().toISOString()
          })
          .eq('id', idToUpdate);

        if (error) {
          console.error('Error updating school config:', error);
          throw error;
        }
      } catch (error) {
        console.error('Failed to update config in Supabase:', error);
        throw error;
      }
    }
    
    setIsConfigured(true);
  }, [schoolId]); // Only recreate if schoolId changes

  return (
    <ConfigContext.Provider value={{ 
      config, 
      updateConfig, 
      isConfigured, 
      schoolSlug, 
      schoolId,
      loading,
      templateId,
      templateName,
      loadSchoolConfig 
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

