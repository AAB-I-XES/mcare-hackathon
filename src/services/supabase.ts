import { createClient, SupabaseClient, User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';
import { UserRole } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('placeholder')
  );
};

// Safe lazy client instance to prevent runtime crashes if keys are unconfigured
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
};

export const signInWithGoogleOAuth = async (intendedRole: UserRole = 'worker') => {
  const client = getSupabase();
  if (!client) {
    throw new Error(
      'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    );
  }

  // Store intended role in sessionStorage to recover after OAuth redirect
  try {
    sessionStorage.setItem('pending_oauth_role', intendedRole);
  } catch (e) {
    console.warn('Could not store pending role in sessionStorage:', e);
  }

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${window.location.pathname}`,
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

export const signInWithEmailSupabase = async (email: string, password: string) => {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim(),
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signUpWithEmailSupabase = async (
  email: string,
  password: string,
  metadata?: { full_name?: string; role?: UserRole; [key: string]: any }
) => {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await client.auth.signUp({
    email: email.trim(),
    password: password.trim(),
    options: {
      data: metadata || {},
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOutSupabase = async () => {
  const client = getSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
  }
};

export const getSupabaseSession = async (): Promise<SupabaseSession | null> => {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data } = await client.auth.getSession();
    return data.session;
  } catch {
    return null;
  }
};

export const onSupabaseAuthStateChange = (
  callback: (event: string, session: SupabaseSession | null) => void
): (() => void) => {
  const client = getSupabase();
  if (!client) {
    return () => {};
  }

  const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
};

export type { SupabaseUser, SupabaseSession };
