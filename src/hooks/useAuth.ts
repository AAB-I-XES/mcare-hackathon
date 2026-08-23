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
  getSupabaseSession,
  onSupabaseAuthStateChange,
  signOutSupabase,
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

  const login = useCallback((user: AppUser, token: string) => {
    saveSession(user, token);
    setCurrentUser(user);
    setAuthToken(token);
    setPendingSetupUser(null);
  }, []);

  const logout = useCallback(() => {
    signOutSupabase();
    clearSession();
    setCurrentUser(null);
    setAuthToken(null);
    setPendingSetupUser(null);
  }, []);

  const startSetup = useCallback((setupUser: PendingSetupUser) => {
    setPendingSetupUser(setupUser);
  }, []);

  const cancelSetup = useCallback(() => {
    signOutSupabase();
    clearSession();
    setPendingSetupUser(null);
    setCurrentUser(null);
    setAuthToken(null);
  }, []);

  // Sync Supabase Auth State (OAuth redirects, Google Logins, Email Logins)
  useEffect(() => {
    initStorage();

    const handleSupabaseSession = async (session: any) => {
      if (!session || !session.user) return;

      const user = session.user;
      const userEmail = user.email ? user.email.toLowerCase() : '';
      const activeSession = getStoredSession();

      // If already logged in as this user, don't interrupt
      if (activeSession.user && (activeSession.user.id === user.id || (userEmail && activeSession.user.email === userEmail))) {
        return;
      }

      // Check if user already exists in local registered data
      const existingWorker = getWorkerById(user.id) || (userEmail ? getWorkerByEmail(userEmail) : null);
      if (existingWorker) {
        login({ ...existingWorker, role: 'worker', email: user.email }, session.access_token || `token_${user.id}`);
        return;
      }

      const existingProvider = getProviderById(user.id) || (userEmail ? getProviderByEmail(userEmail) : null);
      if (existingProvider) {
        login({ ...existingProvider, role: 'provider', email: user.email }, session.access_token || `token_${user.id}`);
        return;
      }

      const existingEmployer = getEmployerById(user.id) || (userEmail ? getEmployerByEmail(userEmail) : null);
      if (existingEmployer) {
        login({ ...existingEmployer, role: 'employer', email: user.email }, session.access_token || `token_${user.id}`);
        return;
      }

      // If new OAuth user, retrieve chosen role from sessionStorage or default to 'worker'
      let pendingRole: UserRole = 'worker';
      try {
        const storedRole = sessionStorage.getItem('pending_oauth_role') as UserRole | null;
        if (storedRole && ['worker', 'provider', 'employer'].includes(storedRole)) {
          pendingRole = storedRole;
          sessionStorage.removeItem('pending_oauth_role');
        }
      } catch {
        // ignore
      }

      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        (user.email ? user.email.split('@')[0] : 'Google User');
      const photoUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

      startSetup({
        id: user.id,
        name: fullName,
        email: user.email,
        photo_url: photoUrl,
        role: pendingRole,
        token: session.access_token,
      });
    };

    // Check initial Supabase session
    getSupabaseSession().then((session) => {
      if (session) {
        handleSupabaseSession(session);
      }
    });

    // Listen for auth state changes
    const unsubscribeSupabase = onSupabaseAuthStateChange((_event, session) => {
      if (session) {
        handleSupabaseSession(session);
      }
    });

    const unsubscribeStorage = subscribeToStorage(() => {
      refreshUser();
    });

    return () => {
      unsubscribeSupabase();
      unsubscribeStorage();
    };
  }, [login, refreshUser, startSetup]);

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

