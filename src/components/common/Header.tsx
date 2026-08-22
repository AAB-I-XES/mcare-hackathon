import React from 'react';
import { ShieldCheck, LogOut, Stethoscope, Building2, User, ChevronRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { AppUser } from '../../types';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  user?: AppUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const { t } = useI18n();

  return (
    <header className="w-full px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        {!user ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 tracking-tight leading-tight">
                MigrantCare
              </span>
              <span className="badge-clean badge-clean-sky text-[10px] uppercase font-bold py-0.5 px-1.5 ml-1.5">
                Pass
              </span>
            </div>
          </div>
        ) : user.role === 'worker' ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-sky-400 bg-slate-100 shrink-0 shadow-xs">
              <img src={user.photo_url} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 leading-tight">
                  {user.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  Worker Passport
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono-code font-semibold">
                {user.health_id}
              </span>
            </div>
          </div>
        ) : user.role === 'provider' ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 leading-tight">
                  {user.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Doctor / Clinic EMR
                </span>
              </div>
              <span className="text-xs text-slate-500">{user.facility || 'Clinic Station'} · Reg: {user.reg_no}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 leading-tight">
                  {user.company || 'Worksite Safety'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Employer Gate Check
                </span>
              </div>
              <span className="text-xs text-slate-500">Site Supervisor Clearance Terminal</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <LanguageToggle />

        {user && onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 transition cursor-pointer"
            title="Switch Dashboard or Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Switch Portal</span>
          </button>
        )}
      </div>
    </header>
  );
};
