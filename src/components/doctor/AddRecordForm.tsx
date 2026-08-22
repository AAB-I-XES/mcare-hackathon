import React, { useState } from 'react';
import { PlusCircle, Stethoscope, Pill, Syringe, FlaskConical, CheckCircle2 } from 'lucide-react';
import { MedicalRecordType } from '../../types';
import { useI18n } from '../../i18n';

interface AddRecordFormProps {
  onSubmitRecord: (type: MedicalRecordType, notes: string) => void;
  isSaving: boolean;
  saveSuccess: boolean;
}

export const AddRecordForm: React.FC<AddRecordFormProps> = ({
  onSubmitRecord,
  isSaving,
  saveSuccess,
}) => {
  const { t } = useI18n();
  const [recordType, setRecordType] = useState<MedicalRecordType>('visit');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    onSubmitRecord(recordType, notes);
    setNotes('');
  };

  const recordTypes: { id: MedicalRecordType; label: string; icon: React.ReactNode }[] = [
    { id: 'visit', label: 'Clinic Visit', icon: <Stethoscope className="w-3.5 h-3.5" /> },
    { id: 'prescription', label: 'Prescription', icon: <Pill className="w-3.5 h-3.5" /> },
    { id: 'vaccination', label: 'Vaccination', icon: <Syringe className="w-3.5 h-3.5" /> },
    { id: 'lab_result', label: 'Lab Result', icon: <FlaskConical className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="minimal-card p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">{t('enterRecordTitle')}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Log notes, prescriptions, or vaccinations to patient&apos;s portable record
          </p>
        </div>
        {saveSuccess && (
          <span className="badge-clean badge-clean-emerald text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('successRecord')}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Record Type Selection Pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            {t('recordType')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {recordTypes.map((rt) => (
              <button
                key={rt.id}
                type="button"
                onClick={() => setRecordType(rt.id)}
                className={`p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                  recordType === rt.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {rt.icon}
                <span>{rt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Clinical Note Text Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {t('notes')}
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Follow-up consultation for cough. Vital signs normal (BP 120/80). Prescribed Salbutamol inhaler. Cleared for normal duties."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full minimal-input p-3 text-sm leading-relaxed"
            required
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving || !notes.trim()}
            className="btn-minimal-primary bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : t('addRecordBtn')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
