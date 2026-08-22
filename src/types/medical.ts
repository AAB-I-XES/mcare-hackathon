export type MedicalRecordType = 'visit' | 'prescription' | 'lab_result' | 'vaccination';

export interface MedicalRecord {
  id: string;
  worker_id: string;
  type: MedicalRecordType;
  provider_name: string;
  facility_name: string;
  notes: string;
  attachments?: string[];
  created_at: string;
}

export interface NewMedicalRecordInput {
  worker_id: string;
  type: MedicalRecordType;
  provider_name: string;
  facility_name: string;
  notes: string;
  attachments?: string[];
}

export interface EmployerStatusResult {
  success: boolean;
  name: string;
  health_id: string;
  status: string;
  vaccinated: boolean;
  vaccineCount: number;
  recommendations: string;
  error?: string;
}
