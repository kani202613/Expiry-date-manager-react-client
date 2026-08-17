import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import './AuthPage.css';

export default function LoginPage({ onSwitchToRegister, onBackToHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <div className="auth-page-wrapper">
      {/* Background Glows */}
      <div className="auth-glow-1"></div>
      <div className="auth-glow-2"></div>

      <div className="auth-page-card">
        {onBackToHome && (
          <button onClick={onBackToHome} className="btn-back-home">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
        )}

        <div className="auth-card-header">
          <Logo size="large" />
          <h2 className="auth-card-title">Welcome Back</h2>
          <p className="auth-card-subtitle">Sign in to manage your inventory</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <ShieldAlert size={18} className="auth-error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-container">
          <div className="auth-input-group">
            <label className="auth-input-label">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-input-icon" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                required
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                required
                minLength={6}
                className="auth-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-toggle-pwd"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-blue">
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-card-footer">
          <span>Don't have an account yet? </span>
          <button onClick={onSwitchToRegister} className="auth-switch-btn auth-switch-orange">
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
}
