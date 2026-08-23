import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Stethoscope,
  Building2,
  CheckCircle2,
  Droplet,
  AlertTriangle,
  Heart,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  LogOut,
  Mail,
  Sparkles,
  Phone,
  Calendar,
  Building,
  FileBadge,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useI18n, Locale, SUPPORTED_LANGUAGES } from '../../i18n';
import { AppUser, UserRole, WorkerUser, ProviderUser, EmployerUser } from '../../types';
import {
  registerWorker,
  registerProvider,
  registerEmployer,
  updateSupabaseUserProfile,
} from '../../services';
import { LanguageToggle } from '../common/LanguageToggle';
import { BLOOD_GROUPS, COMMON_CHRONIC_CONDITIONS } from '../../constants/medicalOptions';
import { PendingSetupUser } from '../../hooks/useAuth';

interface UserInfoSetupViewProps {
  pendingUser: PendingSetupUser;
  onComplete: (user: AppUser, token: string) => void;
  onCancel: () => void;
}

export const UserInfoSetupView: React.FC<UserInfoSetupViewProps> = ({
  pendingUser,
  onComplete,
  onCancel,
}) => {
  const { t, locale } = useI18n();

  const [role, setRole] = useState<UserRole>(pendingUser.role || 'worker');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Worker Form State
  const [fullName, setFullName] = useState(pendingUser.name || '');
  const [dob, setDob] = useState('1996-05-12');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('+65 ');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [preferredLang, setPreferredLang] = useState<Locale>(locale);
  const [emergencyContact, setEmergencyContact] = useState('');

  // Doctor Form State
  const [doctorName, setDoctorName] = useState(pendingUser.name || '');
  const [facilityName, setFacilityName] = useState('');
  const [regNo, setRegNo] = useState(`MCR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [doctorPhone, setDoctorPhone] = useState('+65 ');

  // Employer Form State
  const [employerName, setEmployerName] = useState(pendingUser.name || '');
  const [companyName, setCompanyName] = useState('');
  const [worksite, setWorksite] = useState('');
  const [employerPhone, setEmployerPhone] = useState('+65 ');

  const toggleCondition = (condId: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condId) ? prev.filter((c) => c !== condId) : [...prev, condId]
    );
  };

  const handleNextWorkerStep1 = () => {
    setErrorMessage('');
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full legal name');
      return;
    }
    if (!dob) {
      setErrorMessage('Please provide your date of birth');
      return;
    }
    if (!phone.trim() || phone.trim() === '+65') {
      setErrorMessage('Please enter your mobile phone number');
      return;
    }
    setStep(2);
  };

  const handleWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // 1. Save worker to database
      const worker = registerWorker({
        id: pendingUser.id,
        name: fullName.trim(),
        dob,
        gender,
        phone: phone.trim(),
        blood_group: bloodGroup,
        allergies: allergies.trim(),
        chronic_conditions: selectedConditions,
        preferred_language: preferredLang,
        photo_url: pendingUser.photo_url,
        emergency_contact: emergencyContact.trim() || 'Primary Kin on file',
        email: pendingUser.email,
        status: 'Fit for Work',
        vaccinated: true,
        vaccine_count: 3,
        recommendations: 'Fit for all standard workplace and industrial assignments.',
      });

      // 2. Update Supabase metadata if logged in with Supabase
      await updateSupabaseUserProfile({
        role: 'worker',
        name: fullName.trim(),
        dob,
        gender,
        phone: phone.trim(),
        blood_group: bloodGroup,
        allergies: allergies.trim(),
        chronic_conditions: selectedConditions,
        preferred_language: preferredLang,
        emergency_contact: emergencyContact.trim(),
        health_id: worker.health_id,
        profile_completed: true,
      });

      // 3. Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      const token = pendingUser.token || `token_sb_${worker.id}`;
      setTimeout(() => {
        onComplete(worker, token);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete profile setup');
      setIsSubmitting(false);
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!doctorName.trim()) {
      setErrorMessage('Please enter your clinical provider name');
      return;
    }
    if (!facilityName.trim()) {
      setErrorMessage('Please provide your hospital or clinic facility name');
      return;
    }
    if (!regNo.trim()) {
      setErrorMessage('Please provide your Medical Council registration number');
      return;
    }

    setIsSubmitting(true);
    try {
      const provider = registerProvider({
        id: pendingUser.id,
        name: doctorName.trim(),
        facility: facilityName.trim(),
        reg_no: regNo.trim(),
        email: pendingUser.email,
      });

      await updateSupabaseUserProfile({
        role: 'provider',
        name: doctorName.trim(),
        facility: facilityName.trim(),
        reg_no: regNo.trim(),
        profile_completed: true,
      });

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
      });

      const token = pendingUser.token || `token_sb_${provider.id}`;
      setTimeout(() => {
        onComplete(provider, token);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete clinic profile setup');
      setIsSubmitting(false);
    }
  };

  const handleEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!employerName.trim()) {
      setErrorMessage('Please enter your name or company representative name');
      return;
    }
    if (!companyName.trim()) {
      setErrorMessage('Please provide your company or contractor name');
      return;
    }

    setIsSubmitting(true);
    try {
      const employer = registerEmployer({
        id: pendingUser.id,
        name: employerName.trim(),
        company: companyName.trim(),
        email: pendingUser.email,
      });

      await updateSupabaseUserProfile({
        role: 'employer',
        name: employerName.trim(),
        company: companyName.trim(),
        profile_completed: true,
      });

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
      });

      const token = pendingUser.token || `token_sb_${employer.id}`;
      setTimeout(() => {
        onComplete(employer, token);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete employer profile setup');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="w-full px-6 py-3.5 flex items-center justify-between border-b border-slate-200 bg-white shadow-xs sticky top-0 z-20">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cancel & Sign Out</span>
        </button>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-900 text-sm">Digital Health Profile Setup</span>
        </div>

        <LanguageToggle />
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        {/* Google Authentication Verified Banner */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {pendingUser.photo_url ? (
              <img
                src={pendingUser.photo_url}
                alt={pendingUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border border-slate-200 object-cover shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 border border-sky-200">
                {pendingUser.name?.charAt(0) || 'G'}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">{pendingUser.name}</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Google Verified
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate">{pendingUser.email || 'Google Account'}</span>
              </div>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-slate-400 shrink-0 hidden sm:inline">
            Step 1 of 1 Setup
          </span>
        </div>

        {/* Setup Card */}
        <div className="minimal-card p-6 sm:p-8 space-y-6 shadow-md">
          {/* Role Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Your System Role
            </label>
            <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 gap-1">
              <button
                type="button"
                onClick={() => {
                  setRole('worker');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  role === 'worker'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-sky-600" />
                <span>Worker</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('provider');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  role === 'provider'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                <span>Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('employer');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-md flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  role === 'employer'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Employer</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* WORKER FLOW */}
          {role === 'worker' && (
            <div className="space-y-6">
              {/* Stepper for Worker */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    1
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Personal</span>
                </div>
                <div className="flex-1 h-0.5 mx-2 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Medical</span>
                </div>
                <div className="flex-1 h-0.5 mx-2 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === 3 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    3
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Finish</span>
                </div>
              </div>

              {/* Step 1: Personal */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Verify your identity to generate your encrypted QR Health Pass
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        {t('fullName')}
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Tareq Rahman"
                        className="w-full minimal-input px-3.5 py-2.5"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{t('dob')}</span>
                        </label>
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full minimal-input px-3.5 py-2.5"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          {t('gender')}
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value as any)}
                          className="w-full minimal-input px-3.5 py-2.5 bg-white cursor-pointer"
                        >
                          <option value="Male">{t('male')}</option>
                          <option value="Female">{t('female')}</option>
                          <option value="Other">{t('other')}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{t('phoneLabel')} (For OTP & Access)</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+65 8123 4567"
                        className="w-full minimal-input px-3.5 py-2.5"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextWorkerStep1}
                    className="w-full btn-minimal-primary cursor-pointer mt-2"
                  >
                    <span>Continue to Medical Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Medical */}
              {step === 2 && (
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
                      onClick={() => setStep(1)}
                      className="btn-minimal-secondary cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn-minimal-primary cursor-pointer"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Preferences & Confirm */}
              {step === 3 && (
                <form onSubmit={handleWorkerSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Final Confirmation</h3>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Set language preferences and emergency details
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Preferred Language for Medical Records
                      </label>
                      <select
                        value={preferredLang}
                        onChange={(e) => setPreferredLang(e.target.value as Locale)}
                        className="w-full minimal-input px-3.5 py-2.5 bg-white cursor-pointer"
                      >
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.nativeName} ({lang.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Emergency Contact (Next of Kin)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Brother (Farhan): +65 9182 7364"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        className="w-full minimal-input px-3.5 py-2.5"
                      />
                    </div>

                    {/* Consent & Privacy Notice */}
                    <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <UserCheck className="w-4 h-4 text-emerald-700" />
                        <span>Zero Data Leakage Guarantee</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Clinics cannot view your past notes without your active QR scan &amp; 5-minute approval. Employers can only view non-clinical fitness clearance.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-minimal-secondary cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-minimal-primary bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
                    >
                      <span>{isSubmitting ? 'Issuing Pass...' : 'Issue My Health Pass'}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* DOCTOR / CLINIC PROVIDER FLOW */}
          {role === 'provider' && (
            <form onSubmit={handleDoctorSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Clinical Provider Credentials</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Register your medical licensing details to enable consent-based worker consultations
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Provider Legal / Medical Name
                  </label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full minimal-input px-3.5 py-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hospital / Clinic Facility Name</span>
                  </label>
                  <input
                    type="text"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="e.g. Regional Community Health Center, Clinic #3"
                    className="w-full minimal-input px-3.5 py-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FileBadge className="w-3.5 h-3.5 text-sky-600" />
                    <span>Medical Council / Registration Number</span>
                  </label>
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. MCR-2024-8192"
                    className="w-full minimal-input px-3.5 py-2.5 font-mono-code"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Clinic Direct Line</span>
                  </label>
                  <input
                    type="tel"
                    value={doctorPhone}
                    onChange={(e) => setDoctorPhone(e.target.value)}
                    placeholder="+65 6789 0123"
                    className="w-full minimal-input px-3.5 py-2.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-minimal-primary bg-emerald-700 hover:bg-emerald-800 cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Activating Portal...' : 'Complete Provider Registration'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* EMPLOYER / SAFETY OFFICER FLOW */}
          {role === 'employer' && (
            <form onSubmit={handleEmployerSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Employer & Worksite Information</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Configure corporate credentials for non-clinical fitness verification
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Safety Officer / Manager Name
                  </label>
                  <input
                    type="text"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    placeholder="e.g. David Wong (Safety Director)"
                    className="w-full minimal-input px-3.5 py-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Company / Contractor Name</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Marine & Heavy Construction Pte Ltd"
                    className="w-full minimal-input px-3.5 py-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Worksite / Project Name
                  </label>
                  <input
                    type="text"
                    value={worksite}
                    onChange={(e) => setWorksite(e.target.value)}
                    placeholder="e.g. Jurong Island Petrochemical Sector 4"
                    className="w-full minimal-input px-3.5 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Company Phone</span>
                  </label>
                  <input
                    type="tel"
                    value={employerPhone}
                    onChange={(e) => setEmployerPhone(e.target.value)}
                    placeholder="+65 6543 2100"
                    className="w-full minimal-input px-3.5 py-2.5"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-minimal-primary bg-amber-700 hover:bg-amber-800 cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Setting up Dashboard...' : 'Complete Employer Setup'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
