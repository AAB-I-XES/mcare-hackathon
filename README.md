# MigrantCare — Portable Digital Health Passport & Consent System

**MigrantCare** is a consent-governed, portable digital health credential and electronic medical record (EMR) platform tailored for migrant workers, healthcare providers, and workplace employers.

It solves health record fragmentation and communication barriers across jurisdictions while enforcing strict patient privacy and role-based access control.

---

## 🌟 Core Features & Portals

### 1. 👷 Migrant Worker Portal
* **Portable Digital QR Health ID**: Generates a tamper-evident QR code linked to the worker's unique ID (`MC-XXXX-XXXX`).
* **Time-Bound Consent Engine**: Workers receive real-time clinic access requests and can grant or revoke 5-minute time-locked medical consent.
* **Comprehensive Medical Timeline**: View clinical diagnoses, vaccination history, prescription instructions, vital signs, and doctor notes.
* **Emergency Kin Card**: Instantly accessible emergency contacts for site supervisors and emergency responders.
* **Bilingual Support**: Built-in multi-language toggle (English / Spanish) with translated medical terminology.

### 2. 🩺 Clinic & Doctor Portal
* **QR Health Scanner**: Built-in camera viewfinder and manual entry to lookup patient profiles.
* **Consent Verification**: Verifies active worker consent before unlocking full medical history and sensitive records.
* **Clinical Record Authoring**: Allows doctors to log new diagnoses, medications, dosages, blood pressure/vitals, and fitness certifications.
* **Access Audit Trail**: Records timestamps and clinic IDs for all access sessions.

### 3. 🏢 Employer & Site Supervisor Portal
* **Privacy-Preserving Fitness Verification**: Inspects work fitness clearances and vaccination counts without accessing private clinical notes or diagnoses.
* **Workforce Status Registry**: Search workers by name or ID to check current deployment eligibility ("Fit for Work", "Restricted", "Under Observation").

### 4. 🔐 Flexible Authentication & Supabase Integration
* **Mobile SMS / PIN OTP**: Fast access for workers using simple phone verification.
* **Supabase Email & Password**: Secure role-based user registration and authentication for doctors, employers, and workers.
* **Google Authentication**: Instant one-click Google identity sign-in and Supabase OAuth support.
* **Demo Quick-Access**: One-click demo switchers for rapid inspection across all three stakeholder roles.

---

## 🏗️ Architecture & Tech Stack

* **Frontend**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS with clean, high-contrast accessible components
* **Icons & Animation**: Lucide React, Motion (`motion/react`)
* **State & Sync**: Custom reactive hooks (`useAuth`, `useWorkerConsent`, `useCountdownTimer`) with cross-tab storage sync
* **Backend / Database**: Supabase (`@supabase/supabase-js`) & local storage fallback

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js 18+
* npm or bun

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file (refer to `.env.example`):
```env
# Optional Supabase Integration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Development Server
```bash
npm run dev
```
The application will start on `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🛡️ Privacy & Compliance Model

1. **Zero-Knowledge Fitness Checks**: Employers receive binary clearance indicators and safety recommendations without clinical disclosures.
2. **Explicit Patient Consent**: Healthcare providers cannot view medical notes unless an active 5-minute consent window is authorized by the worker.
3. **Audit Logging**: Every consent grant, view, and medical update is logged with immutable timestamps.
