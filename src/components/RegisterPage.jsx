import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';
import './AuthPage.css';

export default function RegisterPage({ onSwitchToLogin, onBackToHome }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, loading, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    await register(name, email, password);
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
          <h2 className="auth-card-title">Create Account</h2>
          <p className="auth-card-subtitle">Get started with free inventory tracking</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <ShieldAlert size={18} className="auth-error-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-container">
          <div className="auth-input-group">
            <label className="auth-input-label">Full Name</label>
            <div className="auth-input-wrapper">
              <User size={18} className="auth-input-icon" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                required
                className="auth-input auth-input-register"
              />
            </div>
          </div>

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
                className="auth-input auth-input-register"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                required
                minLength={6}
                className="auth-input auth-input-register"
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

          <button type="submit" disabled={loading} className="auth-submit-orange">
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-card-footer">
          <span>Already have an account? </span>
          <button onClick={onSwitchToLogin} className="auth-switch-btn auth-switch-blue">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
