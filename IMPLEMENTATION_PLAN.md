# BEE Residence — Frontend Implementation Plan
**Product:** BEE Residence  
**Tagline:** *Smart Living, Simplified.*  
**Document Version:** 1.1.0  
**Status:** Approved for Implementation  
**Source of Truth:** [`BEE_RESIDENCE_PRD.md` / `PRD.md`](file:///c:/course/Resident_bee_property/PRD.md)

---

## 1. Executive Summary & Workspace Analysis

### 1.1 Workspace Assessment
A thorough analysis of the repository workspace at `c:\course\Resident_bee_property` reveals:
- **Existing Files:**
  - `.git/` — Git repository tracking branch `main`.
  - `PRD.md` (referred to as `BEE_RESIDENCE_PRD.md`) — The master Product Requirements Document defining 15 comprehensive requirement sections, 9 functional modules, and strict acceptance criteria.
  - `README.md` — Boilerplate markdown template.
- **Current Project State:**
  - Initial configuration of React + Vite with Tailwind CSS.
- **Host Runtime Environment:**
  - **Operating System:** Windows 10/11
  - **Node.js:** `v24.18.0`
  - **npm:** `11.16.0`

### 1.2 Identified Dependencies & Configuration
To adhere strictly to the PRD specifications while ensuring optimal DX, high rendering performance, and rock-solid reliability, the following tooling and libraries will be used:

| Package | Version Range | Purpose & Architectural Rationale |
| :--- | :--- | :--- |
| `vite` | `^5.4.11` | Ultra-fast ESM bundler with Instant HMR and optimized production treeshaking |
| `@vitejs/plugin-react` | `^4.3.4` | Babel/SWC-based fast React JSX refresh plugin |
| `react` & `react-dom` | `^18.3.1` | UI rendering engine supporting Concurrent Features and robust lifecycle hooks |
| `react-router-dom` | `^6.28.0` | Client-side routing, route protection guards, query state handling, and layout nesting |
| `tailwindcss` | `^3.4.15` | Utility-first CSS framework configured with BEE Residence custom design tokens |
| `postcss` & `autoprefixer` | `^8.4.49` | Modern CSS processing and automated cross-browser vendor prefixing |
| `lucide-react` | `^0.460.0` | Consistent, accessible outline iconography required by PRD Section 6 |
| `qrcode.react` | `^4.1.0` | Crisp SVG & Canvas rendering for pre-approved digital guest passes and OTP verification |
| `clsx` & `tailwind-merge` | `^2.5.4` | Clean conditional class name merging for atomic UI component variants |

---

## 2. Design System & Visual Architecture

### 2.1 Harmonious Brand Color Palette
The visual design embodies a premium residential SaaS experience combining institutional trust with modern residential warmth.

- **PRIMARY: Deep Navy Blue**
  - `#0B132B` (Obsidian Navy - Primary Background/Headers)
  - `#1C2541` (Slate Navy - Sidebar, Primary Buttons, Active States)
  - `#3A506B` (Muted Navy - Secondary Borders, Card Outlines)
- **ACCENT: Warm Golden Yellow**
  - `#F59E0B` (Amber Gold - Badges, Primary Accents, Quick Action Highlights)
  - `#D97706` (Deep Honey - Focus Rings, Active States, Hover Accents)
  - `#FEF3C7` (Soft Yellow Tint - Alert Callouts, Pending Request Glow)
- **SURFACES & BACKGROUNDS: White & Light Grey**
  - `#FFFFFF` (Pure White - Cards, Modals, Forms, Drawers)
  - `#F8FAFC` (Soft Light Grey - Main App Canvas Background)
  - `#F1F5F9` (Subtle Slate Grey - Section Dividers, Table Striping)
  - `#E2E8F0` (Neutral Slate - Card Borders & Form Inputs)
- **SEMANTIC STATUS INDICATORS**
  - Approved / Completed / Verified: Emerald (`#10B981`, bg: `#ECFDF5`, border: `#A7F3D0`)
  - Pending / In Progress / Waiting: Amber (`#F59E0B`, bg: `#FFFBEB`, border: `#FDE68A`)
  - Rejected / Urgent / Cancelled: Rose (`#F43F5E`, bg: `#FFF1F2`, border: `#FECDD3`)
  - Scheduled / Info / Notices: Indigo (`#6366F1`, bg: `#EEF2FF`, border: `#C7D2FE`)

### 2.2 Typography & Iconography
- **Typography:** Sans-serif stack (`Inter`, `Plus Jakarta Sans`, system-ui).
  - Page Titles: `text-2xl font-bold tracking-tight text-slate-900`
  - Section Headers: `text-lg font-semibold text-slate-800`
  - Body Text: `text-sm text-slate-600`
  - Metadata & Timestamps: `text-xs font-medium text-slate-400`
- **Iconography:** Lucide React outlines styled with uniform stroke-width (1.75px) for consistent visual weight.

---

## 3. Application Architecture & Component Hierarchy

### 3.1 Proposed Component Directory Tree
A clean, modular architecture separating layout, common UI atoms, feature modules, custom hooks, and persistence services:

```
c:\course\Resident_bee_property\
├── public\
│   └── favicon.svg                  # BEE Residence Honeycomb Logo
├── src\
│   ├── assets\                      # Static assets, default avatar fallbacks
│   ├── components\
│   │   ├── common\                  # Atomic, reusable UI primitives
│   │   │   ├── Badge.jsx            # Status badges (Approved, Pending, Urgent, etc.)
│   │   │   ├── Button.jsx           # Primary (Navy), Accent (Gold), Outline, Danger
│   │   │   ├── Card.jsx             # Elevated container with subtle hover shadow
│   │   │   ├── ConfirmDialog.jsx    # Accessible modal for destructive actions
│   │   │   ├── Dropdown.jsx         # Accessible action selector
│   │   │   ├── EmptyState.jsx       # Actionable illustration card for empty feeds
│   │   │   ├── Input.jsx            # Floating label, validation error, icon slot
│   │   │   ├── Modal.jsx            # Keyboard-accessible backdrop dialog
│   │   │   ├── Select.jsx           # Form selector with native/custom options
│   │   │   ├── StatCard.jsx         # KPI metric card with icon & indicator
│   │   │   ├── Tabs.jsx             # Horizontal scrollable tab filter
│   │   │   └── Toast.jsx            # Floating feedback alert system
│   │   ├── layout\                  # Shell & navigation infrastructure
│   │   │   ├── AppLayout.jsx        # Authenticated shell (Sidebar + Topbar + Content)
│   │   │   ├── Header.jsx           # Topbar: Household Switcher, Bell, Profile
│   │   │   ├── MobileNav.jsx        # Sticky bottom navigation bar for mobile
│   │   │   ├── PageHeader.jsx       # Standardized page title, subtitle, and CTA slot
│   │   │   └── Sidebar.jsx          # Desktop & tablet navigation sidebar
│   │   ├── visitors\                # Module C: My Visitors
│   │   ├── services\                # Module D: Home Services
│   │   ├── preapproved\             # Module E: Pre-Approved Visitors
│   │   ├── vehicles\                # Module F: My Vehicles
│   │   ├── notifications\           # Module G: Notifications
│   │   ├── family\                  # Module H: Family Members
│   │   └── profile\                 # Module I: Profile & Settings
│   ├── context\
│   │   ├── AuthContext.jsx          # Auth session, login/logout, persona switching
│   │   ├── HouseholdContext.jsx     # Master state engine & dispatchers
│   │   └── ToastContext.jsx         # Global toast dispatchers
│   ├── data\
│   │   ├── initialSeedData.js       # Curated realistic mock datasets
│   │   └── serviceCategories.js     # Standard 14 maintenance service categories
│   ├── hooks\
│   │   ├── useAuth.js               # Consume AuthContext
│   │   ├── useHousehold.js          # Consume HouseholdContext
│   │   └── useToast.js              # Trigger floating toasts
│   ├── pages\
│   │   ├── DashboardPage.jsx        # Module B: Unified residential dashboard
│   │   ├── FamilyPage.jsx           # Module H: Household members & activity log
│   │   ├── HomeServicesPage.jsx     # Module D: Services (form hidden by default)
│   │   ├── LoginPage.jsx            # Module A: Phone + Password login with demo fill
│   │   ├── NotFoundPage.jsx         # 404 page
│   │   ├── NotificationsPage.jsx    # Module G: Notifications & announcements
│   │   ├── PreApprovedPage.jsx      # Module E: Digital passes, QR & OTP
│   │   ├── ProfilePage.jsx          # Module I: Flat details & preferences
│   │   ├── VehiclesPage.jsx         # Module F: Vehicles & parking slots
│   │   └── VisitorsPage.jsx         # Module C: Gate visitor approvals
│   ├── services\
│   │   ├── storageService.js        # LocalStorage hydration, listeners, writes
│   │   └── ticketGenerator.js       # Unique ID generators (`TKT-`, `VIS-`, `PASS-`)
│   ├── utils\
│   │   ├── formatters.js            # Currency, Indian phone (+91), date/time formats
│   │   ├── validators.js            # Phone, plate, and required field regexes
│   │   └── constants.js             # Route names, categories, and role definitions
│   ├── App.jsx                      # App route provider and protected route guards
│   ├── index.css                    # Tailwind CSS directives and custom animations
│   └── main.jsx                     # Root React entry point
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 4. Routing Structure & Screen Inventory

### 4.1 Route Hierarchy
- Public Route: `/login` (with demo auto-fill)
- Protected Layout:
  - `/` -> redirect to `/dashboard`
  - `/dashboard` -> Dashboard Page
  - `/visitors` -> My Visitors
  - `/pre-approved` -> Pre-Approved Passes
  - `/services` -> Home Services (form hidden by default)
  - `/vehicles` -> My Vehicles
  - `/notifications` -> Notifications
  - `/family` -> Family Members
  - `/profile` -> Profile & Settings
- Fallback: `*` -> NotFound 404

---

## 5. Phased Roadmap Summary

- **Phase 1: Tooling Scaffolding & Design Foundation**
- **Phase 2: UI Library & App Shell**
- **Phase 3: State Engine, LocalStorage & Auth**
- **Phase 4: Dashboard & Priority Gate Modules**
- **Phase 5: Passes & Vehicles**
- **Phase 6: Notifications, Announcements & Family Collaboration**
- **Phase 7: Profile, State Reset & Comprehensive Acceptance Testing**
