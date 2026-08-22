import { useState, useEffect, useCallback } from 'react';
import { AppUser, UserRole } from '../types';
import {
  getStoredSession,
  saveSession,
  clearSession,
  subscribeToStorage,
  initStorage,
  getWorkerById,
  getWorkerByEmail,
  getProviderById,
  getProviderByEmail,
  getEmployerById,
  getEmployerByEmail,
  getSupabase,
  mapSupabaseUserToAppUser,
  isUserProfileCompleted,
  supabaseSignOut,
} from '../services';

export interface PendingSetupUser {
  id: string;
  name: string;
  email?: string;
  photo_url?: string;
  role: UserRole;
  token?: string;
}

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    return getStoredSession().user;
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    return getStoredSession().token;
  });

  const [pendingSetupUser, setPendingSetupUser] = useState<PendingSetupUser | null>(null);

  const refreshUser = useCallback(() => {
    const session = getStoredSession();
    if (session.user && session.user.role === 'worker') {
      const freshWorker = getWorkerById(session.user.id);
      if (freshWorker) {
        setCurrentUser({ ...freshWorker, role: 'worker' });
        return;
      }
    }
    setCurrentUser(session.user);
    setAuthToken(session.token);
  }, []);

  useEffect(() => {
    initStorage();
    const unsubscribe = subscribeToStorage(() => {
      refreshUser();
    });

    // Supabase Auth State listener & initial session check
    const supabase = getSupabase();
    let authListenerSubscription: { unsubscribe: () => void } | null = null;

    if (supabase) {
      const defaultRole = (localStorage.getItem('migrantcare_oauth_role') as UserRole) || 'worker';

      // Check current session immediately (useful on OAuth redirect callback)
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (!error && session?.user) {
          const user = session.user;
          const meta = user.user_metadata || {};
          const role = (meta.role as UserRole) || defaultRole;
          const email = user.email || '';

          // Check if user already exists in storage or has completed profile
          const completedInMetadata = isUserProfileCompleted(user);
          const existingWorker = role === 'worker' ? (getWorkerById(user.id) || getWorkerByEmail(email)) : null;
          const existingProvider = role === 'provider' ? (getProviderById(user.id) || getProviderByEmail(email)) : null;
          const existingEmployer = role === 'employer' ? (getEmployerById(user.id) || getEmployerByEmail(email)) : null;

          if (completedInMetadata || existingWorker || existingProvider || existingEmployer) {
            const appUser = existingWorker
              ? { ...existingWorker, role: 'worker' as const }
              : existingProvider
              ? { ...existingProvider, role: 'provider' as const }
              : existingEmployer
              ? { ...existingEmployer, role: 'employer' as const }
              : mapSupabaseUserToAppUser(user, defaultRole);

            saveSession(appUser, session.access_token);
            setCurrentUser(appUser);
            setAuthToken(session.access_token);
            setPendingSetupUser(null);
          } else {
            // Needs user info setup
            setPendingSetupUser({
              id: user.id,
              name: meta.name || meta.full_name || email.split('@')[0] || 'Google User',
              email: user.email,
              photo_url: meta.avatar_url || meta.picture,
              role,
              token: session.access_token,
            });
          }
        }
      });

      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (
          (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') &&
          session?.user
        ) {
          const user = session.user;
          const meta = user.user_metadata || {};
          const role = (meta.role as UserRole) || defaultRole;
          const email = user.email || '';

          const completedInMetadata = isUserProfileCompleted(user);
          const existingWorker = role === 'worker' ? (getWorkerById(user.id) || getWorkerByEmail(email)) : null;
          const existingProvider = role === 'provider' ? (getProviderById(user.id) || getProviderByEmail(email)) : null;
          const existingEmployer = role === 'employer' ? (getEmployerById(user.id) || getEmployerByEmail(email)) : null;

          if (completedInMetadata || existingWorker || existingProvider || existingEmployer) {
            const appUser = existingWorker
              ? { ...existingWorker, role: 'worker' as const }
              : existingProvider
              ? { ...existingProvider, role: 'provider' as const }
              : existingEmployer
              ? { ...existingEmployer, role: 'employer' as const }
              : mapSupabaseUserToAppUser(user, defaultRole);

            saveSession(appUser, session.access_token);
            setCurrentUser(appUser);
            setAuthToken(session.access_token);
            setPendingSetupUser(null);
          } else {
            setPendingSetupUser({
              id: user.id,
              name: meta.name || meta.full_name || email.split('@')[0] || 'Google User',
              email: user.email,
              photo_url: meta.avatar_url || meta.picture,
              role,
              token: session.access_token,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          clearSession();
          setCurrentUser(null);
          setAuthToken(null);
          setPendingSetupUser(null);
        }
      });
      authListenerSubscription = data.subscription;
    }

    return () => {
      unsubscribe();
      if (authListenerSubscription) {
        authListenerSubscription.unsubscribe();
      }
    };
  }, [refreshUser]);

  const login = useCallback((user: AppUser, token: string) => {
    saveSession(user, token);
    setCurrentUser(user);
    setAuthToken(token);
    setPendingSetupUser(null);
  }, []);

  const logout = useCallback(() => {
    supabaseSignOut();
    clearSession();
    setCurrentUser(null);
    setAuthToken(null);
    setPendingSetupUser(null);
  }, []);

  const startSetup = useCallback((setupUser: PendingSetupUser) => {
    setPendingSetupUser(setupUser);
  }, []);

  const cancelSetup = useCallback(() => {
    supabaseSignOut();
    clearSession();
    setPendingSetupUser(null);
    setCurrentUser(null);
    setAuthToken(null);
  }, []);

  return {
    currentUser,
    authToken,
    pendingSetupUser,
    login,
    logout,
    startSetup,
    cancelSetup,
    refreshUser,
    isAuthenticated: !!currentUser,
  };
};
