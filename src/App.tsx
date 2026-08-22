import React, { useState } from 'react';
import { LanguageProvider } from './i18n';
import { useAuth } from './hooks';
import {
  AuthView,
  RegisterView,
  WorkerDashboard,
  DoctorDashboard,
  EmployerDashboard,
  NemotronChatDrawer,
} from './components';

function AppContent() {
  const { currentUser, login, logout } = useAuth();
  const [viewState, setViewState] = useState<'auth' | 'register'>('auth');
  const [registrationPhone, setRegistrationPhone] = useState('');

  const handleRegisterSuccess = (user: any, token: string) => {
    login(user, token);
    setViewState('auth');
  };

  const renderMainView = () => {
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
          registrationPhone={registrationPhone}
          setRegistrationPhone={setRegistrationPhone}
        />
      );
    }

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
