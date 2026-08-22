import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useI18n, Locale } from '../../i18n';
import { AppUser } from '../../types';
import { registerWorker } from '../../services';
import { LanguageToggle } from '../common/LanguageToggle';
import { StepIndicator } from './StepIndicator';
import { StepPersonal } from './StepPersonal';
import { StepMedical } from './StepMedical';
import { StepPreferences } from './StepPreferences';

interface RegisterViewProps {
  phone: string;
  initialName?: string;
  onRegisterSuccess: (user: AppUser, token: string) => void;
  onCancel: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({
  phone: initialPhone,
  initialName = '',
  onRegisterSuccess,
  onCancel,
}) => {
  const { t, locale } = useI18n();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState(initialName || '');
  const [dob, setDob] = useState('1994-06-18');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState(initialPhone || '+65 8123 4567');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [preferredLang, setPreferredLang] = useState<Locale>(locale);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCondition = (cond: string) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const handleNextFromPersonal = () => {
    setErrorMessage('');
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name');
      return;
    }
    if (!dob) {
      setErrorMessage('Please provide your date of birth');
      return;
    }
    setStep(2);
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const newWorker = registerWorker({
        name: fullName,
        dob,
        gender,
        phone,
        blood_group: bloodGroup,
        allergies,
        chronic_conditions: selectedConditions,
        preferred_language: preferredLang,
        emergency_contact: emergencyContact || 'Contact on file',
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onRegisterSuccess({ ...newWorker, role: 'worker' }, `token_reg_${newWorker.id}`);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create Health Profile');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <header className="w-full px-6 py-3.5 flex items-center justify-between border-b border-slate-200 bg-white shadow-xs">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-800" />
          <span className="font-bold text-slate-900 text-sm">{t('registerTitle')}</span>
        </div>
        <LanguageToggle />
      </header>

      {/* Form Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        <div className="minimal-card p-6 sm:p-8 space-y-6 shadow-md">
          <StepIndicator currentStep={step} />

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 && (
            <StepPersonal
              fullName={fullName}
              setFullName={setFullName}
              dob={dob}
              setDob={setDob}
              gender={gender}
              setGender={setGender}
              phone={phone}
              setPhone={setPhone}
              onNext={handleNextFromPersonal}
            />
          )}

          {step === 2 && (
            <StepMedical
              bloodGroup={bloodGroup}
              setBloodGroup={setBloodGroup}
              allergies={allergies}
              setAllergies={setAllergies}
              selectedConditions={selectedConditions}
              toggleCondition={toggleCondition}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <StepPreferences
              preferredLang={preferredLang}
              setPreferredLang={setPreferredLang}
              emergencyContact={emergencyContact}
              setEmergencyContact={setEmergencyContact}
              isSubmitting={isSubmitting}
              onBack={() => setStep(2)}
              onSubmit={handleCompleteRegistration}
            />
          )}
        </div>
      </main>

      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        <p>MigrantCare Encrypted Health Passport Protocol</p>
      </footer>
    </div>
  );
};
