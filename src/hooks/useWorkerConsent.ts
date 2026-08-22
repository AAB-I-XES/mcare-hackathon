import { useState, useEffect, useCallback } from 'react';
import { AccessRequest, MedicalRecord, AccessLog } from '../types';
import {
  getRecords,
  getAccessLogs,
  getActiveRequestsForWorker,
  respondToRequest,
  subscribeToStorage,
} from '../services';

export const useWorkerConsent = (workerId: string) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [pendingRequests, setPendingRequests] = useState<AccessRequest[]>([]);
  const [isResponding, setIsResponding] = useState(false);

  const loadData = useCallback(() => {
    if (!workerId) return;
    setRecords(getRecords(workerId));
    setLogs(getAccessLogs(workerId));
    const active = getActiveRequestsForWorker(workerId);
    setPendingRequests(active.filter((r) => r.status === 'pending'));
  }, [workerId]);

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStorage(() => {
      loadData();
    });
    const interval = setInterval(loadData, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [loadData]);

  const handleRespond = async (requestId: string, action: 'approve' | 'deny') => {
    setIsResponding(true);
    respondToRequest(requestId, action);
    setTimeout(() => {
      setIsResponding(false);
      loadData();
    }, 200);
  };

  return {
    records,
    logs,
    pendingRequests,
    isResponding,
    handleRespond,
    reload: loadData,
  };
};
