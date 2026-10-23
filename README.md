# BEE Residence — Smart Living, Simplified

A residential community management web application built for apartment residents to manage gate visitors, home maintenance services, pre-approved guest passes, household vehicles, and family member permissions through one centralized platform.

---

## 🌟 Key Features Implemented

### 1. Authentication & Role-Based Access (`/login`)
- Phone number login (+91 format for India).
- Password visibility toggle (show / hide).
- Remember me functionality with LocalStorage persistence.
- Forgot password workflow with simulated OTP delivery.
- One-click demo persona switcher:
  - **Rajesh Kumar** (Household Head) — `+91 98765 43210` / `bee123`
  - **Priya Kumar** (Household Member) — `+91 98765 43211` / `bee123`
- Protected route redirection.

### 2. Residential Dashboard (`/dashboard`)
- Personalized dynamic greeting ("Good afternoon, Rajesh!").
- Apartment context badge: **Tower A, Flat 1204 — Bee Hive Residency**.
- Live metric counters: Pending Visitors, Active Service Requests, Upcoming Passes, Registered Vehicles, Unread Alerts.
- Quick action shortcuts to generate passes, book services, register vehicles, and invite family members.
- Live feed of recent gate arrivals with direct one-click decisions (Approve, Reject, Leave at Gate).
- Active service request progress tracker.
- Clickable community announcements bulletin.

### 3. Visitor Management (`/visitors`)
- Categorized visitor directory: Courier, Food Delivery, Friends, Service Technician, Other.
- Search by visitor name, company (Amazon, Swiggy, etc.), vehicle number, or arrival purpose.
- Multi-status filter tabs: All, Pending, Approved, Leave at Gate, Rejected, Completed.
- **Single-Decision Lock (Shared Household Sync)**:
  - Once any authorized household member approves, rejects, or instructs gate security, the status locks immediately.
  - Displays decider name, timestamp, and optional guard note. Prevents duplicate decisions.
- **Simulate Visitor Arrival**: Reviewers can click to test real-time gate arrivals and notifications.

### 4. Home Services & Maintenance (`/services`)
- **Strictly Hidden Form by Default**: The service request form never displays automatically.
- Inspection modal: Residents can inspect booked service tickets, view technician details, and check lifecycle progression without opening the new request form.
- Multi-step lifecycle visualizer:
  `Pending ➔ Approved ➔ Scheduled ➔ In Progress ➔ Completed` (or `Cancelled`).
- Service request form modal (opens only when "Add Service Request" is clicked):
  - Categories: Plumbing, Electrical Repairs, Water Pump, AC, Washing Machine, Wi-Fi, Carpentry, Painting, Pest Control, etc.
  - Urgency levels: Urgent, High, Normal, Can Wait.
  - Preferred date and time slot selection.
  - Form validation, confetti feedback, and unique ticket ID generation (`TKT-2026-XXXX`).

### 5. Pre-Approved Digital Passes (`/pre-approved`)
- Advance guest registration for friends, family, deliveries, and cabs.
- Digital Pass ticket modal designed like a modern digital boarding pass / wallet ticket:
  - Scannable QR Code generated with `qrcode.react`.
  - 6-digit Gate Entry OTP with one-click copy button.
  - Print pass and Share via link/WhatsApp support.
  - "Simulate Gate Scan" button to mark pass as Used.
  - Cancel pass option with confirmation.

### 6. Vehicle Registration & Parking (`/vehicles`)
- Indian number plate formatting with authentic `IND` blue badge and green styling for Electric Vehicles.
- Household parking slot allocation display (`B2-P45`, `B2-P46 (EV)`).
- **Duplicate Plate Validation**: Prevents registering duplicate license numbers within the household.
- Owner assignment, make/model, color, RFID tag preview, edit and delete actions.

### 7. Notifications & Alerts (`/notifications`)
- Categories: Visitors, Services, Community Announcements, Emergency notices.
- Unread badge counters in the top navigation bar.
- Direct navigation from notification click to the corresponding record.
- Mark individual as read, mark all as read, and delete.

### 8. Family Members & Activity Audit Log (`/family`)
- Household overview with Head of Household badge.
- Add, edit, and remove household members with role permissions (Household Head vs Member).
- **Duplicate Phone Validation**: Ensures each family member has a unique phone number.
- **Household Activity Audit Trail**: Real-time chronological audit log recording every visitor decision, service ticket, and pass created across household members.
- Instant persona switcher to test the resident experience as different members.

### 9. Profile & Settings (`/profile`)
- Resident personal information and move-in details.
- Change password form.
- Notification preference toggles (Visitor alerts, Service updates, WhatsApp notifications).
- Emergency Directory (Main gate intercom 101, Concierge, Facility Manager, Police, Ambulance).
- Reset factory demo data button.

---

## 🛠 Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom palette (Deep Navy `#0B132B`, Bee Gold `#F59E0B`, Soft Slate `#F8FAFC`)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **QR Code**: `qrcode.react`
- **Animations & Effects**: `canvas-confetti`, custom CSS glassmorphism, micro-transitions
- **Persistence**: LocalStorage with automatic schema serialization and seed recovery

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone <repository_url>
cd Resident_bee_property

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will run at: **http://localhost:3000/**

### Building for Production
```bash
npm run build
```

---

## 👤 Demo Credentials

| Role | Name | Phone Number | Password |
|---|---|---|---|
| **Household Head** | Rajesh Kumar | `9876543210` | `bee123` |
| **Household Member** | Priya Kumar | `9876543211` | `bee123` |
| **Household Member** | Sunita Kumar | `9876543212` | `bee123` |
| **Household Member** | Rohan Kumar | `9876543213` | `bee123` |