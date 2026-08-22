import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { ProviderUser, WorkerUser, MedicalRecord, MedicalRecordType } from '../../types';
import { useI18n } from '../../i18n';
import {
  getWorkerByHealthId,
  createAccessRequest,
  respondToRequest,
  checkGrantStatus,
  getRecords,
  addRecord,
  subscribeToStorage,
} from '../../services';
import { useCountdownTimer } from '../../hooks';
import { Header, Footer } from '../common';
import { PatientSearchSection } from './PatientSearchSection';
import { ScannerModal } from './ScannerModal';
import { PendingApprovalCard } from './PendingApprovalCard';
import { ActiveSessionHeader } from './ActiveSessionHeader';
import { AddRecordForm } from './AddRecordForm';
import { PatientHistorySection } from './PatientHistorySection';

interface DoctorDashboardProps {
  user: ProviderUser;
  onLogout: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user, onLogout }) => {
  const { t } = useI18n();

  const [healthIdInput, setHealthIdInput] = useState('');
  const [activePatient, setActivePatient] = useState<WorkerUser | null>(null);
  const [pendingWorker, setPendingWorker] = useState<WorkerUser | null>(null);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<string | undefined>(undefined);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const { formatted: formattedCountdown } = useCountdownTimer(
    sessionExpiresAt,
    () => {
      // Session expired
      setActivePatient(null);
      setSessionExpiresAt(undefined);
      setErrorMessage('Patient access session has expired. Request consent again.');
    }
  );

  const checkStatus = useCallback(() => {
    if (pendingWorker) {
      const grant = checkGrantStatus(pendingWorker.id, user.id);
      if (grant.active && grant.worker) {
        setActivePatient(grant.worker);
        setSessionExpiresAt(grant.expiresAt);
        setPendingWorker(null);
        setPendingRequestId(null);
        setPatientRecords(getRecords(grant.worker.id));
      } else if (grant.status === 'denied') {
        setErrorMessage(t('accessDenied'));
        setPendingWorker(null);
        setPendingRequestId(null);
      }
    } else if (activePatient) {
      setPatientRecords(getRecords(activePatient.id));
    }
  }, [pendingWorker, user.id, activePatient, t]);

  useEffect(() => {
    checkStatus();
    const unsubscribe = subscribeToStorage(() => {
      checkStatus();
    });
    const interval = setInterval(checkStatus, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [checkStatus]);

  const handleRequestConsent = (e?: React.FormEvent, directHealthId?: string) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    const idToSearch = (directHealthId || healthIdInput).trim();

    if (!idToSearch) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const worker = getWorkerByHealthId(idToSearch);
      if (!worker) {
        setErrorMessage(t('idNotFound'));
        return;
      }

      const res = createAccessRequest({
        worker_id: worker.id,
        provider_id: user.id,
        provider_name: user.name,
        facility_name: user.facility,
      });

      if (res.alreadyGranted) {
        setActivePatient(worker);
        setSessionExpiresAt(res.request.expires_at);
        setPatientRecords(getRecords(worker.id));
      } else {
        setPendingWorker(worker);
        setPendingRequestId(res.request.id);
      }
    }, 300);
  };

  const handleSimulateWorkerApproval = () => {
    if (pendingRequestId) {
      respondToRequest(pendingRequestId, 'approve');
    }
  };

  const handleAddRecord = (type: MedicalRecordType, notes: string) => {
    if (!activePatient) return;
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      addRecord({
        worker_id: activePatient.id,
        type,
        provider_name: user.name,
        facility_name: user.facility,
        notes,
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setPatientRecords(getRecords(activePatient.id));
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  const handleEndSession = () => {
    setActivePatient(null);
    setSessionExpiresAt(undefined);
    setHealthIdInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-sky-500 selection:text-white">
      <Header user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Patient Search / QR Scan Section */}
        {!activePatient && !pendingWorker && (
          <PatientSearchSection
            healthIdInput={healthIdInput}
            setHealthIdInput={setHealthIdInput}
            onRequestConsent={handleRequestConsent}
            onOpenScanner={() => setIsScannerOpen(true)}
            onQuickSelect={(id) => {
              setHealthIdInput(id);
              handleRequestConsent(undefined, id);
            }}
            isLoading={isLoading}
          />
        )}

        {/* Step 2: Pending Approval Wait State */}
        {pendingWorker && (
          <PendingApprovalCard
            patient={pendingWorker}
            onSimulateWorkerApproval={handleSimulateWorkerApproval}
            onCancel={() => {
              setPendingWorker(null);
              setPendingRequestId(null);
            }}
          />
        )}

        {/* Step 3: Active Patient Session (Consent Granted) */}
        {activePatient && (
          <div className="space-y-6">
            <ActiveSessionHeader
              patient={activePatient}
              formattedCountdown={formattedCountdown}
              onEndSession={handleEndSession}
            />

            <AddRecordForm
              onSubmitRecord={handleAddRecord}
              isSaving={isSaving}
              saveSuccess={saveSuccess}
            />

            <PatientHistorySection records={patientRecords} />
          </div>
        )}
      </main>

      {/* QR Code Camera Scanner Modal */}
      {isScannerOpen && (
        <ScannerModal
          onScan={(scannedId) => {
            setIsScannerOpen(false);
            setHealthIdInput(scannedId);
            handleRequestConsent(undefined, scannedId);
          }}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
};
