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

export const getProviders = (): ProviderUser[] => {
  return getItem<ProviderUser[]>(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
};

export const getProviderById = (id: string): ProviderUser | null => {
  const providers = getProviders();
  return providers.find((p) => p.id === id) || null;
};

export const getProviderByEmail = (email: string): ProviderUser | null => {
  const providers = getProviders();
  const normalized = email.trim().toLowerCase();
  return providers.find((p) => p.email && p.email.toLowerCase() === normalized) || null;
};

export const registerProvider = (data: {
  id?: string;
  name: string;
  facility: string;
  reg_no: string;
  email?: string;
}): ProviderUser => {
  const providers = getProviders();
  const existingIndex = providers.findIndex(
    (p) => (data.id && p.id === data.id) || (data.email && p.email && p.email.toLowerCase() === data.email.toLowerCase())
  );

  const newProvider: ProviderUser = {
    id: data.id || (existingIndex >= 0 ? providers[existingIndex].id : `prov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`),
    name: data.name.trim(),
    role: 'provider',
    facility: data.facility.trim(),
    reg_no: data.reg_no.trim(),
    email: data.email || (existingIndex >= 0 ? providers[existingIndex].email : undefined),
    created_at: existingIndex >= 0 ? providers[existingIndex].created_at : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    providers[existingIndex] = newProvider;
  } else {
    providers.unshift(newProvider);
  }
  setItem(STORAGE_KEYS.PROVIDERS, providers);
  return newProvider;
};

export const getEmployers = (): EmployerUser[] => {
  return getItem<EmployerUser[]>(STORAGE_KEYS.EMPLOYERS, INITIAL_EMPLOYERS);
};

export const getEmployerById = (id: string): EmployerUser | null => {
  const employers = getEmployers();
  return employers.find((e) => e.id === id) || null;
};

export const getEmployerByEmail = (email: string): EmployerUser | null => {
  const employers = getEmployers();
  const normalized = email.trim().toLowerCase();
  return employers.find((e) => e.email && e.email.toLowerCase() === normalized) || null;
};

export const registerEmployer = (data: {
  id?: string;
  name: string;
  company: string;
  email?: string;
}): EmployerUser => {
  const employers = getEmployers();
  const existingIndex = employers.findIndex(
    (e) => (data.id && e.id === data.id) || (data.email && e.email && e.email.toLowerCase() === data.email.toLowerCase())
  );

  const newEmployer: EmployerUser = {
    id: data.id || (existingIndex >= 0 ? employers[existingIndex].id : `emp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`),
    name: data.name.trim(),
    role: 'employer',
    company: data.company.trim(),
    email: data.email || (existingIndex >= 0 ? employers[existingIndex].email : undefined),
    created_at: existingIndex >= 0 ? employers[existingIndex].created_at : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    employers[existingIndex] = newEmployer;
  } else {
    employers.unshift(newEmployer);
  }
  setItem(STORAGE_KEYS.EMPLOYERS, employers);
  return newEmployer;
};

export const getDemoProvider = (): ProviderUser => {
  const providers = getItem<ProviderUser[]>(STORAGE_KEYS.PROVIDERS, INITIAL_PROVIDERS);
  return providers[0] || INITIAL_PROVIDERS[0];
};

export const getDemoEmployer = (): EmployerUser => {
  const employers = getItem<EmployerUser[]>(STORAGE_KEYS.EMPLOYERS, INITIAL_EMPLOYERS);
  return employers[0] || INITIAL_EMPLOYERS[0];
};
