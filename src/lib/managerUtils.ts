import { supabase } from './supabase';

/**
 * Check if a user is a manager for a specific high school
 */
export async function isManagerForSchool(
  userEmail: string,
  highSchoolSlug: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('school_managers')
      .select('id')
      .eq('manager_email', userEmail)
      .eq('high_school_slug', highSchoolSlug)
      .maybeSingle();

    if (error) {
      console.error('Error checking manager status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Unexpected error checking manager status:', error);
    return false;
  }
}

/**
 * Get all high schools that a user manages
 */
export async function getManagedSchools(userEmail: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('school_managers')
      .select('high_school_slug')
      .eq('manager_email', userEmail);

    if (error) {
      console.error('Error fetching managed schools:', error);
      return [];
    }

    return data?.map(d => d.high_school_slug) || [];
  } catch (error) {
    console.error('Unexpected error fetching managed schools:', error);
    return [];
  }
}

/**
 * Check if a user is a manager for any school
 */
export async function isManager(userEmail: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('school_managers')
      .select('id')
      .eq('manager_email', userEmail)
      .limit(1);

    if (error) {
      console.error('Error checking manager status:', error);
      return false;
    }

    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Unexpected error checking manager status:', error);
    return false;
  }
}

