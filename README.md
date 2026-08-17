# Media Scope IT Ltd — Official Web Application & Student Portal

> **Media Scope IT Ltd** (RJSC Registration: `C-166968/2020`) is a premier IT Training Course Institute and Enterprise Software Development Company based in Dhanmondi, Dhaka, Bangladesh. Since 2011, Media Scope IT Ltd has delivered practical IT skill training to over 4,000+ graduates and engineered custom software solutions for top corporate and government institutions.

---

## 🌟 Key Features & Highlights

### 🎓 1. Context-Aware Dual-Role Authentication System
- **Student Account Mode**: Triggered automatically when enrolling in IT training courses (cyan badge `🎓 Student`).
- **Corporate Client Account Mode**: Triggered automatically when requesting enterprise software quotes/demos (orange badge `💼 Client`).
- **Header Profile Toggle**: Universal login modal featuring a role switcher switch for seamless authentication.
- **Auto-Fill Integration**: Automatically populates logged-in user profile details (Name, Phone, Email) into course admission and software proposal forms.

### 💳 2. 3-Step Online Payment & Checkout Gateway (`AdmissionModal.jsx`)
- **Step 1 — Course Selection & Student Profile Details**: Choose course edition (Online / Offline Lab) and batch timing.
- **Step 2 — bKash / Nagad / Card Payment Methods**:
  - **bKash Merchant Pay**: `
  - **Nagad Merchant Pay**: `
  - **Visa / MasterCard & City Bank Transfer**
  - **TrxID Validation & Security Captcha**: Math problem verification to prevent spam.
- **Step 3 — Digital Admission Slip**: Generates an instant downloadable admission receipt (`ADM-2026-8492`) with student credentials.

### 📜 3. Dedicated Certificate Verification Portal (`CertVerificationPage.jsx`)
- **Dedicated Hash Route**: Accessible live at `#cert-verification`.
- **Search Verification**: Instant lookup by Certificate Registration Code (e.g. `MS-2026-101`, `MS-2026-102`).
- **Luxury Canvas Document Viewer**:
  - **10px Double Cyan Border** with golden corner flourishes (`❖`).
  - **Watermark Logo**: Translucent background logo seal.
  - **QR Code Security Scanner**: Scans to verify authenticity on `mediascopeit.com`.
  - **Metallic 3D Gold Seal**: `VERIFIED ACADEMIC` emblem badge.
  - **Signatures**: Managing Director (`Engr. Tanvir Hossain Khan`) and Controller of Examinations.
- **1-Page A4 Landscape Print Isolation (`@media print`)**: Hides website headers, footers, search boxes, and floating WhatsApp buttons during printing, outputting a clean single sheet of paper (`@page { size: A4 landscape; }`).

### 🗺️ 4. Full HTML5 Browser Hash Routing Sync
- Synchronizes address bar URL hash across 18 unique pages:
  - `#home`, `#about-us`, `#company-profile`, `#md-message`, `#team`, `#our-clients`
  - `#courses`, `#web-courses`, `#graphics-courses`, `#marketing-courses`, `#software-courses`, `#programming-courses`, `#others-courses`
  - `#services`, `#web-services`, `#marketing-services`, `#software-services`, `#other-services`, `#cert-verification`
- Full support for browser **Back `←`** and **Forward `→`** navigation history buttons.

### 🎨 5. Premium Dark Aesthetic & Equal Card Height Layouts
- **Design Palette**: Sleek dark theme (`#070A12`, `#0F172A`) with vibrant Cyan (`#00B4D8`), Gold (`#FFB703`), and Amber (`#FF6B00`) accents.
- **Fading Gradient Masks**: Image cover containers feature smooth transparent fading masks (`mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)`).
- **100% Equal Card Heights**: Applied across all grid cards (Courses, Services, Corporate Clients, Student Reviews, Blog) using CSS Flexbox rules (`height: 100%`, `flex: 1`, `margin-top: auto`).

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React (Vite)** | Frontend Web UI Framework (JSX, Hooks, Functional Components) |
| **Vanilla CSS3** | Custom Styling, Design Tokens, Flexbox/Grid, Dark Theme |
| **Lucide React** | Modern SVG Icon Library |
| **HTML5 History API** | Hash Routing & Browser Navigation Sync |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/company-website.git
   cd company-website
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 👨‍💻 Developed By

- **Developer**: **Tanvir Hossain Khan**
- **LinkedIn Profile**: [Tanvir Hossain Khan](https://www.linkedin.com/in/tanvir-khan-90122a30b)
- **Managing Director**: Engr. Tanvir Hossain Khan
- **Company**: **Media Scope IT Ltd**
- **Admission Hotline**: `+88 01714-691963`
- **Email**: `info@mediascopeit.com`
- **Location**: House-32, Road-02, Dhanmondi, Dhaka-1205, Bangladesh.

---

*© 2026 Media Scope IT Ltd (RJSC: C-166968/2020). All Rights Reserved.*
