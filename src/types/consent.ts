export type AccessRequestStatus = 'pending' | 'approved' | 'denied' | 'expired' | 'none';

export interface AccessRequest {
  id: string;
  worker_id: string;
  provider_id: string;
  provider_name: string;
  facility_name: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  requested_at: string;
  expires_at: string;
}

export interface AccessLog {
  id: string;
  worker_id: string;
  viewer_name: string;
  viewer_role: string;
  facility: string;
  access_type: string;
  timestamp: string;
}

export interface AccessGrantStatus {
  active: boolean;
  status: AccessRequestStatus;
  worker?: import('./user').WorkerUser;
  expiresAt?: string;
}
