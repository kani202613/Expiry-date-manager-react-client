import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import AddProductPage from './components/AddProductPage';
import EditProductPage from './components/EditProductPage';
import './App.css';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'login' | 'register' | 'dashboard' | 'addProduct' | 'editProduct'
  const [productToEdit, setProductToEdit] = useState(null);

  const handleNavigateToEdit = (product) => {
    setProductToEdit(product);
    setCurrentView('editProduct');
  };

  if (isAuthenticated) {
    if (currentView === 'addProduct') {
      return <AddProductPage onBackToDashboard={() => setCurrentView('dashboard')} />;
    }
    if (currentView === 'editProduct') {
      return (
        <EditProductPage
          productToEdit={productToEdit}
          onBackToDashboard={() => {
            setProductToEdit(null);
            setCurrentView('dashboard');
          }}
        />
      );
    }
    return (
      <Dashboard
        onNavigateToAddProduct={() => setCurrentView('addProduct')}
        onNavigateToEditProduct={handleNavigateToEdit}
      />
    );
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
