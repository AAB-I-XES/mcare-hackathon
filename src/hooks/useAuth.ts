import { useState, useEffect, useCallback } from 'react';
import { AppUser, UserRole } from '../types';
import {
  getStoredSession,
  saveSession,
  clearSession,
  subscribeToStorage,
  initStorage,
  getWorkerById,
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

    return () => {
      unsubscribe();
    };
  }, [refreshUser]);

  const login = useCallback((user: AppUser, token: string) => {
    saveSession(user, token);
    setCurrentUser(user);
    setAuthToken(token);
    setPendingSetupUser(null);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
    setAuthToken(null);
    setPendingSetupUser(null);
  }, []);

  const startSetup = useCallback((setupUser: PendingSetupUser) => {
    setPendingSetupUser(setupUser);
  }, []);

  const cancelSetup = useCallback(() => {
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
