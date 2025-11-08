import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          user_id: string;
          high_school_slug: string;
          club_slug: string;
          template_id: string;
          config: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          high_school_slug: string;
          club_slug: string;
          template_id: string;
          config: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          high_school_slug?: string;
          club_slug?: string;
          template_id?: string;
          config?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          description: string;
          preview_image?: string;
          default_config: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          preview_image?: string;
          default_config: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          preview_image?: string;
          default_config?: any;
          created_at?: string;
        };
      };
    };
  };
};

