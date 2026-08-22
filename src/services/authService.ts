import { AppUser, WorkerUser, ProviderUser, EmployerUser } from '../types';
import { STORAGE_KEYS, getItem, setItem, initStorage } from './storage';
import { INITIAL_PROVIDERS, INITIAL_EMPLOYERS } from '../constants/mockData';

export const getStoredSession = (): { user: AppUser | null; token: string | null } => {
  initStorage();
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const user = userJson ? (JSON.parse(userJson) as AppUser) : null;
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
};

export const saveSession = (user: AppUser, token: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const getDemoProvider = (): ProviderUser => {
  const providers = getItem<ProviderUser[]>(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
  return providers[0] || INITIAL_PROVIDERS[0];
};

export const getDemoEmployer = (): EmployerUser => {
  const employers = getItem<EmployerUser[]>(STORAGE_KEYS.EMPLOYERS, INITIAL_EMPLOYERS);
  return employers[0] || INITIAL_EMPLOYERS[0];
};
