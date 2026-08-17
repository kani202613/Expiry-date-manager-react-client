# Walkthrough - Expiry Date Manager (React Client)

Comprehensive walkthrough history for the **Expiry Guard** React client application.

## 1. Authentication & Global State
- **API Client (`src/services/api.js`)**: Configured Axios client targeting `http://localhost:5001`. Injects JWT Bearer token into headers from `localStorage` and handles 401 unauthenticated errors.
- **Auth Context (`src/context/AuthContext.jsx`)**: Context provider managing user state, login, registration, auto-token storage, and logout.
- **Login Page (`src/components/LoginPage.jsx`)**: Dedicated login interface with email and password fields integrated with `/api/auth/login`. Features real-time error banner, show/hide password toggle, and loading spinners.
- **Register Page (`src/components/RegisterPage.jsx`)**: Dedicated signup interface with name, email, and password fields integrated with `/api/auth/register`. Enforces minimum password length (6 characters) and auto-logs in upon registration.
- **Auth Styling (`src/components/AuthPage.css`)**: Custom styling enforcing exact vertical/horizontal centering, `padding-left: 48px` on inputs to eliminate icon/text overlaps, and border-contained action buttons.

## 2. Landing Page & Design System
- **Tailwind CSS Integration**: Configured Tailwind CSS v4 in `vite.config.js` and `src/index.css`.
- **Custom Theme Colors**:
  - Primary Color: `#3498db` (Dodger/Sky Blue)
  - Secondary Color: `#e67e22` (Warm Pumpkin/Amber Orange)
- **Brand Logo (`src/components/Logo.jsx`)**: ShieldCheck icon enclosed in a radial gradient ring (`#3498db` to `#e67e22`), pulsing notification indicator, and typography.
- **Landing Page (`src/components/LandingPage.jsx` & `src/components/LandingPage.css`)**:
  - **Header**: Logo, nav options, "Log In" button, "Register Free" button.
  - **Hero Section**: Headline ("Never Miss an Expiry Date Again"), sub-heading, category badges (Food & Groceries, Medicines & Supplies, Cosmetics & Skincare, Warranties & Subscriptions), and CTA buttons.
  - **Feature Grid**: Cards for Smart Reminders, Multi-Category Support, and Zero Waste Savings.
  - **How It Works**: 3-step workflow (Log Items ➔ Track Status ➔ Use & Save).
  - **Footer**: Brand logo, copyright text, and navigation links.

## 3. Dashboard & Inventory Tracking
- **Navigation Bar (`src/components/Navbar.jsx`)**: Displays logo, user profile avatar, welcome message, "Add Item" CTA, and Logout button.
- **Stats Overview (`src/components/StatsOverview.jsx`)**: Interactive counters for Total Active, Expiring Soon, Expired, and Consumed items.
- **Alert Banner (`src/components/AlertBanner.jsx`)**: Highlights items expiring within 7 days or already expired.
- **Filter Bar (`src/components/FilterBar.jsx`)**: Search input with clear button, category selector dropdown, status filter tabs (Active, Expiring Soon, Expired, Consumed), and sort order controls.
- **Item Cards & Grid (`src/components/ItemCard.jsx`, `src/components/ItemGrid.jsx`)**: Card view displaying item name, category badge, quantity, unit, expiry status badge, notes, edit, delete, and "Mark as Consumed" action.
- **Expiry Status Badges (`src/components/ExpiryBadge.jsx`)**: Relative date helper producing color-coded status badges (Green for safe, Orange for expiring in <7 days, Red for expired, Purple for consumed).
- **Add / Edit Modal (`src/components/ItemModal.jsx`)**: Modal dialog with form inputs for name, category, quantity, unit, expiry date, purchase date, status, and notes.

## 4. Verification
- Production build checked via `npm run build`: Compiled in 710ms with zero errors.
- Dev server running live at `http://localhost:5174/`.
