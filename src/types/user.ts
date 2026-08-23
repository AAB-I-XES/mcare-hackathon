export type UserRole = 'worker' | 'provider' | 'employer';

export interface BaseUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  created_at?: string;
}

export interface WorkerUser extends BaseUser {
  role: 'worker';
  health_id: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  blood_group: string;
  allergies: string;
  chronic_conditions: string[];
  preferred_language: 'en' | 'hi' | 'bn' | 'as' | 'es';
  photo_url: string;
  emergency_contact?: string;
  status: 'Fit for Work' | 'Restricted' | 'Under Observation';
  vaccinated: boolean;
  vaccine_count: number;
  recommendations: string;
  created_at: string;
}

export interface ProviderUser extends BaseUser {
  role: 'provider';
  facility: string;
  reg_no: string;
}

export interface EmployerUser extends BaseUser {
  role: 'employer';
  company: string;
}

export type AppUser = WorkerUser | ProviderUser | EmployerUser;
