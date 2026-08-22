import React, { useState } from 'react';
import { FileText, ShieldAlert, ShieldCheck, Sparkles, QrCode } from 'lucide-react';
import { WorkerUser } from '../../types';
import { useI18n } from '../../i18n';
import { useWorkerConsent } from '../../hooks';
import { Header, Footer } from '../common';
import { HealthIdCard } from './HealthIdCard';
import { EmergencyProfile } from './EmergencyProfile';
import { MedicalTimeline } from './MedicalTimeline';
import { AccessLogsTab } from './AccessLogsTab';
import { ConsentRequestModal } from './ConsentRequestModal';
import { DigitalPassportModal } from './DigitalPassportModal';

interface WorkerDashboardProps {
  user: WorkerUser;
  onLogout: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ user, onLogout }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'timeline' | 'logs'>('timeline');
  const [showPassportModal, setShowPassportModal] = useState(false);

  const {
    records,
    logs,
    pendingRequests,
    isResponding,
    handleRespond,
  } = useWorkerConsent(user.id);

  const currentPending = pendingRequests[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-sky-500 selection:text-white">
      <Header user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Top Worker Passport Header Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-400/20 text-sky-200 border border-sky-400/30">
                Worker Medical Passport
              </span>
              <span className="text-xs text-sky-200 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                Self-Sovereign Consent Active
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              {user.name} · Digital Health Pass
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Show your QR code to clinics or employers. Only you control who sees your records; doctor access expires automatically in 5 minutes.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-700/50 pt-3 sm:pt-0">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Health ID</span>
            <span className="text-sm font-mono-code font-bold text-sky-400">{user.health_id}</span>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Passport Valid
            </span>
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
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'timeline'
                  ? 'border-sky-600 text-sky-950 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t('timelineTab')}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
                {records.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'logs'
                  ? 'border-sky-600 text-sky-950 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t('logsTab')} (Audit Trail)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
                {logs.length}
              </span>
            </button>
          </div>

          {activeTab === 'timeline' ? (
            <MedicalTimeline records={records} />
          ) : (
            <AccessLogsTab logs={logs} />
          )}
        </div>
      </main>

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
