import React, { useState } from 'react';
import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  QrCode,
  Camera,
  Plus,
} from 'lucide-react';
import { WorkerUser, NewMedicalRecordInput } from '../../types';
import { useI18n } from '../../i18n';
import { useWorkerConsent } from '../../hooks';
import { addRecord } from '../../services';
import { Header, Footer } from '../common';
import { HealthIdCard } from './HealthIdCard';
import { EmergencyProfile } from './EmergencyProfile';
import { MedicalTimeline } from './MedicalTimeline';
import { AccessLogsTab } from './AccessLogsTab';
import { ConsentRequestModal } from './ConsentRequestModal';
import { DigitalPassportModal } from './DigitalPassportModal';
import { DocumentScannerModal } from './DocumentScannerModal';

interface WorkerDashboardProps {
  user: WorkerUser;
  onLogout: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ user, onLogout }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'timeline' | 'logs'>('timeline');
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  const {
    records,
    logs,
    pendingRequests,
    isResponding,
    handleRespond,
    reload,
  } = useWorkerConsent(user.id);

  const currentPending = pendingRequests[0];

  const handleSaveScannedRecord = (recordInput: NewMedicalRecordInput) => {
    addRecord(recordInput);
    reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-sky-500 selection:text-white">
      <Header user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Top Worker Passport Header Banner */}
        <div className="p-5 sm:p-6 rounded-xl bg-slate-900 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-sky-300 border border-slate-700">
                Personal Medical Pass
              </span>
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Active Sovereign Consent
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {user.name}
            </h1>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Show your QR code to registered clinics or workplace safety officers. Consultation history is only unlocked with your active 5-minute approval.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0 gap-2 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block tracking-wider">Health ID</span>
              <span className="text-sm font-mono-code font-bold text-sky-400">{user.health_id}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className="btn-minimal-primary bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer border-sky-500 hover:border-sky-400"
            >
              <Camera className="w-3.5 h-3.5 text-slate-950" />
              <span>Scan Record</span>
            </button>
          </div>
        </div>

        {/* Top: Digital Health ID & QR Scanner Card */}
        <HealthIdCard
          worker={user}
          onOpenPassportModal={() => setShowPassportModal(true)}
        />

        {/* Emergency Medical Indicators */}
        <EmergencyProfile worker={user} />

        {/* Navigation Tabs (Medical Timeline vs Who Checked My Data) */}
        <div className="space-y-4">
          <div className="flex border-b border-slate-200 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'timeline'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>{t('timelineTab')}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                {records.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'logs'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <span>{t('logsTab')} (Audit Trail)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                {logs.length}
              </span>
            </button>
          </div>

          {activeTab === 'timeline' ? (
            <MedicalTimeline
              records={records}
              onOpenScanner={() => setShowScannerModal(true)}
            />
          ) : (
            <AccessLogsTab logs={logs} />
          )}
        </div>
      </main>

      {/* Camera Document Scanner Modal */}
      {showScannerModal && (
        <DocumentScannerModal
          workerId={user.id}
          onClose={() => setShowScannerModal(false)}
          onRecordSaved={handleSaveScannedRecord}
        />
      )}

      {/* Real-time Consent Request Modal Popup */}
      {currentPending && (
        <ConsentRequestModal
          request={currentPending}
          onApprove={() => handleRespond(currentPending.id, 'approve')}
          onDeny={() => handleRespond(currentPending.id, 'deny')}
          isResponding={isResponding}
        />
      )}

      {/* Passport Preview Modal */}
      {showPassportModal && (
        <DigitalPassportModal
          worker={user}
          onClose={() => setShowPassportModal(false)}
        />
      )}

      <Footer />
    </div>
  );
};
