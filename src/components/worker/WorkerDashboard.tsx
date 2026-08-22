import React, { useState } from 'react';
import { FileText, ShieldAlert } from 'lucide-react';
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
                  ? 'border-slate-900 text-slate-900'
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
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t('logsTab')}</span>
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
