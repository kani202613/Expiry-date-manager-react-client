import Logo from './Logo';
import { ArrowRight, Sparkles, BellRing, Layers, BarChart3, Apple, Pill, Sparkle, Receipt } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage({ onOpenLogin, onOpenRegister }) {
  return (
    <div className="landing-wrapper">
      {/* Background Glow Elements */}
      <div className="landing-glow-1"></div>
      <div className="landing-glow-2"></div>

      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-container">
          <Logo size="medium" />
          <div className="landing-nav-btns">
            <button onClick={onOpenLogin} className="btn-nav-login">
              Log In
            </button>
            <button onClick={onOpenRegister} className="btn-nav-register">
              Register Free
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-badge">
            <Sparkles size={14} className="badge-sparkle" />
            <span>Universal Expiry Date & Inventory Tracker</span>
          </div>

          <h1 className="hero-title">
            Never Miss an Expiry Date Again
          </h1>

          <p className="hero-subtitle">
            Keep track of expiration dates for groceries, medicines, cosmetics, warranties, and subscriptions — all in one clean dashboard with real-time notifications.
          </p>

          <div className="hero-actions">
            <button onClick={onOpenRegister} className="btn-hero-primary">
              <span>Start Tracking Free</span>
              <ArrowRight size={18} />
            </button>

            <button onClick={onOpenLogin} className="btn-hero-secondary">
              <span>Sign In to Dashboard</span>
            </button>
          </div>

          <div className="category-chips-row">
            <div className="chip-item chip-blue">
              <Apple size={14} /> Food & Groceries
            </div>
            <div className="chip-item chip-orange">
              <Pill size={14} /> Medicines & Supplies
            </div>
            <div className="chip-item chip-purple">
              <Sparkle size={14} /> Cosmetics & Skincare
            </div>
            <div className="chip-item chip-green">
              <Receipt size={14} /> Warranties & Subscriptions
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <div className="features-container">
            <div className="section-header">
              <h2 className="section-title">Designed for Total Convenience</h2>
              <p className="section-subtitle">Smart features built to prevent health risks and stop wasteful spending.</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-box icon-blue">
                  <BellRing size={22} />
                </div>
                <h3>Smart Reminders</h3>
                <p>
                  Color-coded status alerts (Safe, Expiring Soon, Expired) keep you informed before items go bad.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box icon-orange">
                  <Layers size={22} />
                </div>
                <h3>Multi-Category Support</h3>
                <p>
                  Track anything: perishables, pantry staples, prescription pills, cosmetics, utilities, and memberships.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon-box icon-green">
                  <BarChart3 size={22} />
                </div>
                <h3>Zero Waste & Savings</h3>
                <p>
                  Log consumed items, monitor usage stats, and prevent buying duplicate or expired goods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="how-it-works-section">
          <div className="section-header">
            <h2 className="section-title">How Expiry Guard Works</h2>
            <p className="section-subtitle">Three simple steps to keep your household inventory organized.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number step-1">1</div>
              <h3>Log Items</h3>
              <p>Add item name, category, quantity, purchase date, and exact expiration date in seconds.</p>
            </div>

            <div className="step-card">
              <div className="step-number step-2">2</div>
              <h3>Track Status</h3>
              <p>Check 7-day countdown warnings and filter by status or category on your dashboard.</p>
            </div>

            <div className="step-card">
              <div className="step-number step-3">3</div>
              <h3>Use & Save</h3>
              <p>Mark items as consumed once used and keep track of your waste reduction statistics.</p>
            </div>
          </div>
        </section>

        {/* CTA BOTTOM BANNER */}
        <section className="cta-banner-section">
          <div className="cta-banner-card">
            <h2>Start Managing Your Household Expiries Today</h2>
            <p>Create your free account today and keep all your household essentials organized.</p>
            <button onClick={onOpenRegister} className="btn-nav-register">
              Create Free Account
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-container">
          <Logo size="small" />
          <div className="footer-copy">
            © {new Date().getFullYear()} Expiry Guard. Universal Expiry Date & Inventory Manager.
          </div>
          <div className="footer-links">
            <button onClick={onOpenLogin} className="footer-link-btn">Log In</button>
            <button onClick={onOpenRegister} className="footer-link-btn">Register</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
