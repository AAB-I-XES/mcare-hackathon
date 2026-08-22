import { useState, useEffect, useCallback } from 'react';
import { AppUser } from '../types';
import {
  getStoredSession,
  saveSession,
  clearSession,
  subscribeToStorage,
  initStorage,
  getWorkerById,
  getSupabase,
  mapSupabaseUserToAppUser,
  supabaseSignOut,
} from '../services';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    return getStoredSession().user;
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    return getStoredSession().token;
  });

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

    // Supabase Auth State listener
    const supabase = getSupabase();
    let authListenerSubscription: { unsubscribe: () => void } | null = null;

    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const appUser = mapSupabaseUserToAppUser(session.user);
          saveSession(appUser, session.access_token);
          setCurrentUser(appUser);
          setAuthToken(session.access_token);
        } else if (event === 'SIGNED_OUT') {
          clearSession();
          setCurrentUser(null);
          setAuthToken(null);
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
  }, []);

  const logout = useCallback(() => {
    supabaseSignOut();
    clearSession();
    setCurrentUser(null);
    setAuthToken(null);
  }, []);

  return {
    currentUser,
    authToken,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!currentUser,
  };
};
