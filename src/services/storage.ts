import { WorkerUser, ProviderUser, EmployerUser, MedicalRecord, AccessRequest, AccessLog } from '../types';
import { INITIAL_WORKERS, INITIAL_PROVIDERS, INITIAL_EMPLOYERS, INITIAL_RECORDS, INITIAL_LOGS } from '../constants/mockData';

export const STORAGE_KEYS = {
  WORKERS: 'mc_workers_db',
  PROVIDERS: 'mc_providers_db',
  EMPLOYERS: 'mc_employers_db',
  RECORDS: 'mc_records_db',
  REQUESTS: 'mc_requests_db',
  LOGS: 'mc_logs_db',
  ACTIVE_USER: 'mc_active_user',
  AUTH_TOKEN: 'mc_auth_token',
  LOCALE: 'mc_locale',
} as const;

export const initStorage = (): void => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.WORKERS)) {
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(INITIAL_WORKERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROVIDERS)) {
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(INITIAL_PROVIDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYERS)) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYERS, JSON.stringify(INITIAL_EMPLOYERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_RECORDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([]));
  }
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const notifyStorageChange = (): void => {
  listeners.forEach((l) => l());
};

export const subscribeToStorage = (listener: Listener): (() => void) => {
  listeners.add(listener);
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key && e.key.startsWith('mc_')) {
      listener();
    }
  };
  window.addEventListener('storage', handleStorageEvent);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorageEvent);
  };
};

export const getItem = <T>(key: string, fallback: T): T => {
  initStorage();
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyStorageChange();
  } catch (e) {
    console.error('Failed to set localStorage key:', key, e);
  }
};

// Domain service re-exports for complete backward compatibility
export * from './authService';
export * from './consentService';
export * from './medicalService';
