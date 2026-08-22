import React, { useState } from 'react';
import { LanguageProvider } from './i18n';
import { useAuth } from './hooks';
import {
  AuthView,
  RegisterView,
  UserInfoSetupView,
  WorkerDashboard,
  DoctorDashboard,
  EmployerDashboard,
  NemotronChatDrawer,
} from './components';

function AppContent() {
  const { currentUser, pendingSetupUser, login, logout, startSetup, cancelSetup } = useAuth();
  const [viewState, setViewState] = useState<'auth' | 'register'>('auth');
  const [registrationPhone, setRegistrationPhone] = useState('');

  const handleRegisterSuccess = (user: any, token: string) => {
    login(user, token);
    setViewState('auth');
  };

  const renderMainView = () => {
    // 1. If user is authenticated via Google/OAuth but has not finished user info setup:
    if (pendingSetupUser) {
      return (
        <UserInfoSetupView
          pendingUser={pendingSetupUser}
          onComplete={(completedUser, token) => {
            login(completedUser, token);
          }}
          onCancel={() => {
            cancelSetup();
            setViewState('auth');
          }}
        />
      );
    }

    // 2. If no active session:
    if (!currentUser) {
      if (viewState === 'register') {
        return (
          <RegisterView
            phone={registrationPhone}
            onRegisterSuccess={handleRegisterSuccess}
            onCancel={() => setViewState('auth')}
          />
        );
      }
      return (
        <AuthView
          onLogin={(user, token) => login(user, token)}
          onShowRegister={() => setViewState('register')}
          onStartGoogleSetup={startSetup}
          registrationPhone={registrationPhone}
          setRegistrationPhone={setRegistrationPhone}
        />
      );
    }

    // 3. Authenticated Role Dashboards:
    if (currentUser.role === 'worker') {
      return <WorkerDashboard user={currentUser} onLogout={logout} />;
    }

    if (currentUser.role === 'provider') {
      return <DoctorDashboard user={currentUser} onLogout={logout} />;
    }

    return <EmployerDashboard user={currentUser} onLogout={logout} />;
  };

  return (
    <div className="relative min-h-screen bg-slate-50">
      {renderMainView()}
      <NemotronChatDrawer user={currentUser} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
