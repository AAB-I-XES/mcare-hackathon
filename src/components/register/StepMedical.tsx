import React from 'react';
import { ArrowLeft, ArrowRight, Droplet, AlertTriangle, Heart, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../i18n';
import { BLOOD_GROUPS, COMMON_CHRONIC_CONDITIONS } from '../../constants/medicalOptions';

interface StepMedicalProps {
  bloodGroup: string;
  setBloodGroup: (bg: string) => void;
  allergies: string;
  setAllergies: (val: string) => void;
  selectedConditions: string[];
  toggleCondition: (cond: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const StepMedical: React.FC<StepMedicalProps> = ({
  bloodGroup,
  setBloodGroup,
  allergies,
  setAllergies,
  selectedConditions,
  toggleCondition,
  onBack,
  onNext,
}) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Medical Baseline</h3>
        <p className="text-slate-500 text-xs mt-0.5">
          Crucial clinical markers for emergency responders & clinics
        </p>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-rose-500" />
            <span>{t('bloodGroup')}</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                type="button"
                onClick={() => setBloodGroup(bg)}
                className={`p-2 rounded-lg text-xs font-mono-code font-bold transition cursor-pointer border ${
                  bloodGroup === bg
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('allergies')}</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Penicillin, Latex, Aspirin (or leave blank)"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="w-full minimal-input px-3.5 py-2.5"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-sky-500" />
            <span>{t('conditions')}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_CHRONIC_CONDITIONS.map((cond) => {
              const isChecked = selectedConditions.includes(cond.id);
              return (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => toggleCondition(cond.id)}
                  className={`p-2.5 rounded-lg text-xs font-semibold text-left transition border flex items-center justify-between cursor-pointer ${
                    isChecked
                      ? 'bg-sky-50 border-sky-500 text-sky-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span>{cond.label}</span>
                  {isChecked && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="btn-minimal-secondary cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          className="btn-minimal-primary cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
