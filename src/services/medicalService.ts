import { WorkerUser, MedicalRecord, NewMedicalRecordInput, EmployerStatusResult } from '../types';
import { STORAGE_KEYS, getItem, setItem } from './storage';
import { INITIAL_WORKERS, INITIAL_RECORDS } from '../constants/mockData';
import { addAccessLog } from './consentService';

export const getWorkers = (): WorkerUser[] => {
  return getItem<WorkerUser[]>(STORAGE_KEYS.WORKERS, INITIAL_WORKERS);
};

export const getWorkerById = (id: string): WorkerUser | null => {
  const workers = getWorkers();
  return workers.find((w) => w.id === id || w.health_id === id) || null;
};

export const getWorkerByHealthId = (healthId: string): WorkerUser | null => {
  const workers = getWorkers();
  const normalized = healthId.trim().toUpperCase();
  return workers.find((w) => w.health_id.toUpperCase() === normalized) || null;
};

export const registerWorker = (data: {
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  blood_group: string;
  allergies: string;
  chronic_conditions: string[];
  preferred_language: 'en' | 'es';
  photo_url?: string;
  emergency_contact?: string;
}): WorkerUser => {
  const workers = getWorkers();
  const randomSuffix1 = Math.floor(1000 + Math.random() * 9000);
  const randomSuffix2 = Math.floor(1000 + Math.random() * 9000);
  const health_id = `MC-${randomSuffix1}-${randomSuffix2}`;

  const newWorker: WorkerUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    role: 'worker',
    health_id,
    name: data.name.trim(),
    dob: data.dob,
    gender: data.gender,
    phone: data.phone.trim() || '+65 8000 0000',
    blood_group: data.blood_group || 'O+',
    allergies: data.allergies.trim(),
    chronic_conditions: data.chronic_conditions,
    preferred_language: data.preferred_language || 'en',
    photo_url:
      data.photo_url ||
      (data.gender === 'Female'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'),
    emergency_contact: data.emergency_contact || 'Contact on file',
    status: 'Fit for Work',
    vaccinated: true,
    vaccine_count: 3,
    recommendations: 'Fit for all standard workplace and job site assignments.',
    created_at: new Date().toISOString(),
  };

  workers.unshift(newWorker);
  setItem(STORAGE_KEYS.WORKERS, workers);

  // Initial issuance medical record
  addRecord({
    worker_id: newWorker.id,
    type: 'visit',
    provider_name: 'Migrant Health Registration Registry',
    facility_name: 'National Digital Health Exchange',
    notes: `Initial Digital Health Profile issued. Blood type ${newWorker.blood_group} documented. Vaccination verified.`,
  });

  return newWorker;
};

export const getRecords = (workerId: string): MedicalRecord[] => {
  const allRecords = getItem<MedicalRecord[]>(STORAGE_KEYS.RECORDS, INITIAL_RECORDS);
  return allRecords.filter((r) => r.worker_id === workerId);
};

export const addRecord = (data: NewMedicalRecordInput): MedicalRecord => {
  const allRecords = getItem<MedicalRecord[]>(STORAGE_KEYS.RECORDS, INITIAL_RECORDS);
  const newRec: MedicalRecord = {
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    worker_id: data.worker_id,
    type: data.type,
    provider_name: data.provider_name,
    facility_name: data.facility_name,
    notes: data.notes,
    attachments: data.attachments || [],
    created_at: new Date().toISOString(),
  };

  allRecords.unshift(newRec);
  setItem(STORAGE_KEYS.RECORDS, allRecords);

  addAccessLog({
    worker_id: data.worker_id,
    viewer_name: data.provider_name,
    viewer_role: 'Doctor / Clinic Staff',
    facility: data.facility_name,
    access_type: `Added Clinical Record (${data.type.toUpperCase()})`,
  });

  return newRec;
};

export const getEmployerStatus = (healthId: string): EmployerStatusResult => {
  const worker = getWorkerByHealthId(healthId);
  if (!worker) {
    return {
      success: false,
      name: '',
      health_id: healthId,
      status: '',
      vaccinated: false,
      vaccineCount: 0,
      recommendations: '',
      error: 'Invalid Health ID. Verification failed.',
    };
  }

  addAccessLog({
    worker_id: worker.id,
    viewer_name: 'Workplace Safety Officer',
    viewer_role: 'Employer Verification',
    facility: 'Workplace Site Gate',
    access_type: 'Fitness Status & Vaccine Clearance Verification',
  });

  return {
    success: true,
    name: worker.name,
    health_id: worker.health_id,
    status: worker.status,
    vaccinated: worker.vaccinated,
    vaccineCount: worker.vaccine_count,
    recommendations: worker.recommendations,
  };
};
