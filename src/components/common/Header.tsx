import { FC } from 'react';
import { ShieldCheck, LogOut, Stethoscope, Building2 } from 'lucide-react';
import { useI18n } from '../../i18n';
import { AppUser } from '../../types';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  user?: AppUser | null;
  onLogout?: () => void;
}

export const Header: FC<HeaderProps> = ({ user, onLogout }) => {
  const { t } = useI18n();

  return (
    <header className="w-full px-4 sm:px-6 py-3 flex items-center justify-between border-b border-slate-200/90 bg-white/95 backdrop-blur-sm sticky top-0 z-30 shadow-[0_1px_2px_0_rgba(15,23,42,0.03)]">
      <div className="flex items-center gap-3">
        {!user ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4.5 h-4.5 text-sky-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900 tracking-tight leading-tight">
                MigrantCare
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                Health ID
              </span>
            </div>
          </div>
        ) : user.role === 'worker' ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-xs">
              <img src={user.photo_url} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 leading-tight">
                  {user.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  Worker ID
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono-code font-semibold">
                {user.health_id}
              </span>
            </div>
          </div>
        ) : user.role === 'provider' ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center shadow-xs border border-slate-800">
              <Stethoscope className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 leading-tight">
                  {user.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Clinical EMR
                </span>
              </div>
              <span className="text-[11px] text-slate-500">{user.facility || 'Clinic Station'} · Reg: {user.reg_no}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shadow-xs border border-slate-800">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 leading-tight">
                  {user.company || 'Worksite Safety'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Gate Terminal
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Site Supervisor Clearance Terminal</span>
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 transition cursor-pointer shadow-xs"
            title="Switch Dashboard or Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Switch Portal</span>
          </button>
        )}
      </div>
    </header>
  );
};
