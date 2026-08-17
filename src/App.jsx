import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import './App.css';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'login' | 'register'

  if (isAuthenticated) {
    return <Dashboard />;
  }

  if (currentView === 'login') {
    return (
      <LoginPage
        onSwitchToRegister={() => setCurrentView('register')}
        onBackToHome={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <RegisterPage
        onSwitchToLogin={() => setCurrentView('login')}
        onBackToHome={() => setCurrentView('landing')}
      />
    );
  }

  return (
    <LandingPage
      onOpenLogin={() => setCurrentView('login')}
      onOpenRegister={() => setCurrentView('register')}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
