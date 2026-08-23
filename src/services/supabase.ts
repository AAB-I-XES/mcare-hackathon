import { createClient, SupabaseClient, User as SupabaseAuthUser } from '@supabase/supabase-js';
import { AppUser, WorkerUser, ProviderUser, EmployerUser, UserRole } from '../types';
import { generateHealthId } from '../utils/formatters';

let supabaseClient: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10);
};

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseClient) {
    const url = import.meta.env.VITE_SUPABASE_URL as string;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
    supabaseClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
      },
    });
  }
  return supabaseClient;
};

export const isUserProfileCompleted = (
  supabaseUser: SupabaseAuthUser
): boolean => {
  const meta = supabaseUser.user_metadata || {};
  if (meta.profile_completed === true) {
    return true;
  }
  const role = meta.role as UserRole | undefined;
  if (role === 'provider' && meta.facility && meta.reg_no) {
    return true;
  }
  if (role === 'employer' && meta.company) {
    return true;
  }
  if (role === 'worker' && meta.dob && meta.blood_group && meta.phone) {
    return true;
  }
  return false;
};

export const updateSupabaseUserProfile = async (
  profileData: Record<string, any>
): Promise<boolean> => {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.auth.updateUser({
      data: {
        ...profileData,
        profile_completed: true,
      },
    });
    return !error;
  } catch (e) {
    console.warn('Failed to update Supabase user profile metadata:', e);
    return false;
  }
};

export const mapSupabaseUserToAppUser = (
  supabaseUser: SupabaseAuthUser,
  defaultRole: UserRole = 'worker'
): AppUser => {
  const meta = supabaseUser.user_metadata || {};
  const role = (meta.role as UserRole) || defaultRole;
  const name = meta.name || meta.full_name || supabaseUser.email?.split('@')[0] || 'User';

  if (role === 'provider') {
    const providerUser: ProviderUser = {
      id: supabaseUser.id,
      name,
      role: 'provider',
      reg_no: meta.reg_no || 'MCR-PENDING',
      facility: meta.facility || meta.facility_name || 'General Health Clinic',
      email: supabaseUser.email,
      created_at: supabaseUser.created_at || new Date().toISOString(),
    };
    return providerUser;
  }

  if (role === 'employer') {
    const employerUser: EmployerUser = {
      id: supabaseUser.id,
      name,
      role: 'employer',
      company: meta.company || meta.company_name || 'Enterprise Employer',
      email: supabaseUser.email,
      created_at: supabaseUser.created_at || new Date().toISOString(),
    };
    return employerUser;
  }

  // Default: Worker
  const workerUser: WorkerUser = {
    id: supabaseUser.id,
    health_id: meta.health_id || generateHealthId(),
    name,
    role: 'worker',
    dob: meta.dob || '1995-01-01',
    gender: (meta.gender as 'Male' | 'Female' | 'Other') || 'Male',
    phone: meta.phone || supabaseUser.phone || '',
    blood_group: meta.blood_group || 'O+',
    allergies: meta.allergies || '',
    chronic_conditions: Array.isArray(meta.chronic_conditions) ? meta.chronic_conditions : [],
    preferred_language: (meta.preferred_language as 'en' | 'hi' | 'bn' | 'as' | 'es') || 'en',
    photo_url:
      meta.photo_url ||
      meta.avatar_url ||
      meta.picture ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    emergency_contact: typeof meta.emergency_contact === 'string' ? meta.emergency_contact : '',
    status: (meta.status as 'Fit for Work' | 'Restricted' | 'Under Observation') || 'Fit for Work',
    vaccinated: meta.vaccinated !== undefined ? Boolean(meta.vaccinated) : true,
    vaccine_count: typeof meta.vaccine_count === 'number' ? meta.vaccine_count : 3,
    recommendations: meta.recommendations || 'Fit for standard workplace assignments.',
    email: supabaseUser.email,
    created_at: supabaseUser.created_at || new Date().toISOString(),
  };
  return workerUser;
};

export interface SupabaseAuthResult {
  success: boolean;
  user?: AppUser;
  token?: string;
  error?: string;
}

export const supabaseSignInWithEmail = async (
  email: string,
  pass: string,
  preferredRole: UserRole = 'worker'
): Promise<SupabaseAuthResult> => {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      error: 'Authentication service not configured. Please use Demo access or Google Sign-In.',
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'User account details could not be retrieved.' };
    }

    const appUser = mapSupabaseUserToAppUser(data.user, preferredRole);
    const token = data.session?.access_token || `token_sb_${data.user.id}`;

    return {
      success: true,
      user: appUser,
      token,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred during authentication.',
    };
  }
};

export const supabaseSignUpWithEmail = async (
  email: string,
  pass: string,
  metadata: {
    name: string;
    role: UserRole;
    phone?: string;
    blood_group?: string;
    allergies?: string;
    facility?: string;
    company?: string;
    reg_no?: string;
  }
): Promise<SupabaseAuthResult> => {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      error: 'Authentication service not configured. Please use Demo access or Google Sign-In.',
    };
  }

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          ...metadata,
          health_id: metadata.role === 'worker' ? generateHealthId() : undefined,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Sign up failed to return user data.' };
    }

    const appUser = mapSupabaseUserToAppUser(data.user, metadata.role);
    const token = data.session?.access_token || `token_sb_${data.user.id}`;

    return {
      success: true,
      user: appUser,
      token,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error creating user profile.',
    };
  }
};

/**
 * Direct Google OAuth Authentication
 */
export const supabaseSignInWithGoogle = async (role: UserRole = 'worker') => {
  const client = getSupabase();
  if (!client) {
    throw new Error('Authentication service is not configured.');
  }

  // Save selected role into localStorage so when OAuth returns, role is maintained
  try {
    localStorage.setItem('migrantcare_oauth_role', role);
  } catch (e) {
    // Ignore storage issues
  }

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const supabaseSignOut = async (): Promise<void> => {
  const client = getSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
  }
};
