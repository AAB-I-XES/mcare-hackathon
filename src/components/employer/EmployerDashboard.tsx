import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  HardHat,
  Filter,
  Lock,
  QrCode,
  FileCheck,
} from 'lucide-react';
import { EmployerUser, EmployerStatusResult } from '../../types';
import { useI18n } from '../../i18n';
import { getEmployerStatus, getWorkers } from '../../services';
import { Header, Footer } from '../common';
import { VerifyForm } from './VerifyForm';
import { HealthPassResultCard } from './HealthPassResultCard';

interface EmployerDashboardProps {
  user: EmployerUser;
  onLogout: () => void;
}

interface VerificationLogEntry {
  id: string;
  workerId: string;
  name: string;
  timestamp: string;
  status: 'Fit for Normal Duty' | 'Restricted' | 'Under Observation';
  vaccineCount: number;
  dutyType: string;
  checkedBy: string;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ user, onLogout }) => {
  const { t } = useI18n();

  const [healthId, setHealthId] = useState('');
  const [result, setResult] = useState<EmployerStatusResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'roster'>('single');

  // Simulated shift log of workers checked at this gate today
  const [gateLogs, setGateLogs] = useState<VerificationLogEntry[]>([
    {
      id: 'log-1',
      workerId: 'MC-5820-1943',
      name: 'Rahim Ullah',
      timestamp: 'Today, 07:45 AM',
      status: 'Fit for Normal Duty',
      vaccineCount: 3,
      dutyType: 'High-Elevation Scaffolding',
      checkedBy: user.name,
    },
    {
      id: 'log-2',
      workerId: 'MC-7731-0024',
      name: 'Elena Rostova',
      timestamp: 'Today, 07:52 AM',
      status: 'Restricted',
      vaccineCount: 2,
      dutyType: 'Ground Level Material Sorting',
      checkedBy: user.name,
    },
    {
      id: 'log-3',
      workerId: 'MC-9104-5821',
      name: 'Tariq Al-Mansoor',
      timestamp: 'Today, 08:05 AM',
      status: 'Fit for Normal Duty',
      vaccineCount: 3,
      dutyType: 'Heavy Machinery Operation',
      checkedBy: user.name,
    },
  ]);

  const handleVerify = (e?: React.FormEvent, directHealthId?: string) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setResult(null);

    const targetId = (directHealthId || healthId).trim();
    if (!targetId) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = getEmployerStatus(targetId);
      if (!res.success) {
        setErrorMessage(t('idNotFound'));
      } else {
        setResult(res);

        // Add to gate log if not already verified recently
        const alreadyLogged = gateLogs.some((l) => l.workerId === res.health_id);
        if (!alreadyLogged) {
          const newEntry: VerificationLogEntry = {
            id: `log-${Date.now()}`,
            workerId: res.health_id,
            name: res.name,
            timestamp: 'Just now',
            status: res.status as any,
            vaccineCount: res.vaccineCount,
            dutyType: 'General Construction Shift',
            checkedBy: user.name,
          };
          setGateLogs((prev) => [newEntry, ...prev]);
        }
      }
    }, 280);
  };

  const allWorkers = getWorkers();
  const clearedCount = gateLogs.filter((l) => l.status === 'Fit for Normal Duty').length;
  const restrictedCount = gateLogs.filter((l) => l.status === 'Restricted').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-amber-500 selection:text-white">
      <Header user={user} onLogout={onLogout} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Top Employer Station Banner */}
        <div className="p-5 sm:p-6 rounded-xl bg-slate-900 text-white shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-300 border border-slate-700">
                Workplace Gate Terminal
              </span>
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Knowledge Privacy Shield
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {user.company || 'BuildTech Site Alpha'} · Gate Security
            </h1>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Verify worker shift readiness, vaccination credentials, and physical restrictions instantly without exposing private diagnoses or clinical history.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0 shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Supervisor</span>
            <span className="text-sm font-bold text-white">{user.name}</span>
            <span className="text-[11px] text-emerald-400 font-mono-code font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Gate Active
            </span>
          </div>
        </div>

        {/* Quick KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Checked Today
            </span>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{gateLogs.length}</p>
            <span className="text-[11px] text-slate-500 font-medium">On-site workers</span>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-xs">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Fit for Duty
            </span>
            <p className="text-2xl font-extrabold text-emerald-800 mt-0.5">{clearedCount}</p>
            <span className="text-[11px] text-emerald-600 font-medium">Unrestricted tasks</span>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 shadow-xs">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
              Restricted Duty
            </span>
            <p className="text-2xl font-extrabold text-amber-800 mt-0.5">{restrictedCount}</p>
            <span className="text-[11px] text-amber-600 font-medium">Light duty assigned</span>
          </div>

          <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 shadow-xs">
            <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
              Vaccine Compliant
            </span>
            <p className="text-2xl font-extrabold text-sky-800 mt-0.5">100%</p>
            <span className="text-[11px] text-sky-600 font-medium">Fully certified</span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Tabs (Single Worker Check vs Shift Gate Log) */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('single')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'single'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Single Worker Pass Check</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'roster'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Shift Gate Log & Roster</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
              {gateLogs.length}
            </span>
          </button>
        </div>

        {activeTab === 'single' ? (
          <div className="space-y-6">
            <VerifyForm
              healthId={healthId}
              setHealthId={setHealthId}
              onVerify={handleVerify}
              onQuickVerify={(id) => {
                setHealthId(id);
                handleVerify(undefined, id);
              }}
              isLoading={isLoading}
            />

            {result && <HealthPassResultCard result={result} />}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="minimal-card p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Today's Shift Gate Log</h3>
                  <p className="text-xs text-slate-500">
                    Real-time log of migrant workers scanned at the workplace gate
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  {gateLogs.length} Checked
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3">Worker / Health ID</th>
                      <th className="py-2.5 px-3">Scan Time</th>
                      <th className="py-2.5 px-3">Clearance Status</th>
                      <th className="py-2.5 px-3">Vaccine</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {gateLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-900">{log.name}</p>
                          <span className="text-[11px] text-slate-500 font-mono-code">
                            {log.workerId}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {log.timestamp}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                              log.status === 'Fit for Normal Duty'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs text-slate-800 font-bold">
                            {log.vaccineCount} doses
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setHealthId(log.workerId);
                              setActiveTab('single');
                              handleVerify(undefined, log.workerId);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-[11px] font-bold transition cursor-pointer"
                          >
                            Inspect Pass
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Shift Roster Verification */}
            <div className="minimal-card p-5 space-y-3 shadow-sm bg-slate-50/70 border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Site Worker Roster (Ready for Shift Clearance):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {allWorkers.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      setHealthId(w.health_id);
                      setActiveTab('single');
                      handleVerify(undefined, w.health_id);
                    }}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/40 text-left transition cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900 group-hover:text-amber-900">
                        {w.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono-code">{w.health_id}</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 group-hover:bg-amber-100 px-2 py-0.5 rounded">
                      Verify Pass →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Zero Data Leakage Privacy Box */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900">
              Zero-Knowledge Architecture Guaranteed
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Employer status checks strictly return fitness verdicts and vaccine compliance tallies. Clinical consultation notes, diagnostic records, and prescriptions remain cryptographically isolated and are never visible to employers.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
