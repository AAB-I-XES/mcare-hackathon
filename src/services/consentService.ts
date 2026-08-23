import { AccessRequest, AccessLog, AccessGrantStatus } from '../types';
import { STORAGE_KEYS, getItem, setItem } from './storage';
import { INITIAL_LOGS } from '../constants/mockData';
import { getWorkerById } from './medicalService';

export const getAccessLogs = (workerId: string): AccessLog[] => {
  const allLogs = getItem<AccessLog[]>(STORAGE_KEYS.LOGS, INITIAL_LOGS);
  return allLogs.filter((l) => l.worker_id === workerId);
};

export const addAccessLog = (data: {
  worker_id: string;
  viewer_name: string;
  viewer_role: string;
  facility: string;
  access_type: string;
}): AccessLog => {
  const allLogs = getItem<AccessLog[]>(STORAGE_KEYS.LOGS, INITIAL_LOGS);
  const newLog: AccessLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    worker_id: data.worker_id,
    viewer_name: data.viewer_name,
    viewer_role: data.viewer_role,
    facility: data.facility,
    access_type: data.access_type,
    timestamp: new Date().toISOString(),
  };

  allLogs.unshift(newLog);
  setItem(STORAGE_KEYS.LOGS, allLogs);

  return newLog;
};

export const getRequests = (workerId?: string): AccessRequest[] => {
  const all = getItem<AccessRequest[]>(STORAGE_KEYS.REQUESTS, []);
  if (workerId) {
    return all.filter((r) => r.worker_id === workerId);
  }
  return all;
};

export const getActiveRequestsForWorker = (workerId: string): AccessRequest[] => {
  const requests = getRequests(workerId);
  const now = Date.now();
  return requests.filter(
    (r) => r.status === 'pending' || (r.status === 'approved' && new Date(r.expires_at).getTime() > now)
  );
};

export const createAccessRequest = (data: {
  worker_id: string;
  provider_id: string;
  provider_name: string;
  facility_name: string;
}): { request: AccessRequest; alreadyGranted: boolean } => {
  const all = getRequests();
  const now = Date.now();

  const existingApproved = all.find(
    (r) =>
      r.worker_id === data.worker_id &&
      r.provider_id === data.provider_id &&
      r.status === 'approved' &&
      new Date(r.expires_at).getTime() > now
  );

  if (existingApproved) {
    return { request: existingApproved, alreadyGranted: true };
  }

  const newReq: AccessRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    worker_id: data.worker_id,
    provider_id: data.provider_id,
    provider_name: data.provider_name,
    facility_name: data.facility_name,
    status: 'pending',
    requested_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  };

  all.unshift(newReq);
  setItem(STORAGE_KEYS.REQUESTS, all);

  return { request: newReq, alreadyGranted: false };
};

export const respondToRequest = (
  requestId: string,
  action: 'approve' | 'deny'
): boolean => {
  const all = getRequests();
  const index = all.findIndex((r) => r.id === requestId);
  if (index === -1) return false;

  const req = all[index];

  if (action === 'approve') {
    req.status = 'approved';
    req.expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    addAccessLog({
      worker_id: req.worker_id,
      viewer_name: req.provider_name,
      viewer_role: 'Doctor / Clinic Staff',
      facility: req.facility_name,
      access_type: 'Access Consent Granted (5-min session active)',
    });
  } else {
    req.status = 'denied';

    addAccessLog({
      worker_id: req.worker_id,
      viewer_name: req.provider_name,
      viewer_role: 'Doctor / Clinic Staff',
      facility: req.facility_name,
      access_type: 'Access Consent Denied by Worker',
    });
  }

  all[index] = req;
  setItem(STORAGE_KEYS.REQUESTS, all);

  return true;
};

export const checkGrantStatus = (
  workerId: string,
  providerId: string
): AccessGrantStatus => {
  const all = getRequests();
  const now = Date.now();
  const req = all.find((r) => r.worker_id === workerId && r.provider_id === providerId);

  if (!req) {
    return { active: false, status: 'none' };
  }

  if (req.status === 'approved') {
    const expires = new Date(req.expires_at).getTime();
    if (expires > now) {
      const worker = getWorkerById(workerId);
      return {
        active: true,
        status: 'approved',
        worker: worker || undefined,
        expiresAt: req.expires_at,
      };
    } else {
      return { active: false, status: 'expired' };
    }
  }

  return { active: false, status: req.status };
};
