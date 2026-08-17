# Implementation Plan - Expiry Date Manager (React Client)

Detailed implementation roadmap for the Expiry Guard React client application.

## Goals & Objectives
- Build a modern, responsive, glassmorphic UI using React 19, Vite, and Tailwind CSS.
- Enforce brand colors `#3498db` (Primary Blue) and `#e67e22` (Secondary Orange).
- Provide JWT authentication flow (Login, Register, Persistent state, Logout).
- Provide a Landing Page for unauthenticated visitors with CTAs, feature cards, and clean typography.
- Provide a full Dashboard with search, category filtering, expiry status indicators, item addition/editing modal, and quick stat counters.

## Component Structure
- `src/services/api.js`: Axios HTTP client with request/response interceptors.
- `src/context/AuthContext.jsx`: Global authentication state provider.
- `src/components/Logo.jsx`: Brand icon and typography logo.
- `src/components/LandingPage.jsx` & `LandingPage.css`: Homepage layout, header, hero, features grid, how-it-works, footer.
- `src/components/LoginPage.jsx` & `AuthPage.css`: Dedicated login interface.
- `src/components/RegisterPage.jsx` & `AuthPage.css`: Dedicated registration interface.
- `src/components/Dashboard.jsx`: Main dashboard layout container.
- `src/components/Navbar.jsx`: Top navigation bar.
- `src/components/StatsOverview.jsx`: Quick statistics summary cards.
- `src/components/AlertBanner.jsx`: Urgent expiry alert banner.
- `src/components/FilterBar.jsx`: Search, category dropdown, status tabs, and sort controls.
- `src/components/ItemGrid.jsx` & `ItemCard.jsx`: Inventory list cards and empty state.
- `src/components/ExpiryBadge.jsx`: Dynamic status badge calculations.
- `src/components/ItemModal.jsx`: Add / Edit item dialog form.

## Verification & Build
- Compiles via `npm run build`.
- Live preview served via Vite dev server.
