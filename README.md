# OK-CV · Precision AI Resume Intelligence & ATS Diagnostics

A modern, responsive, art-directed **AI CV Analyser web application** built with the **MERN Stack** (MongoDB, Express.js, React with JavaScript, Node.js), styled with **Tailwind CSS**, and powered by **Google Gemini AI**.

---

## ✦ Key Features

- **Multi-Format Document Parsing**: Upload candidate resumes in `.pdf`, `.docx`, `.doc`, or `.txt` format using Multer with streaming buffer text extraction (`pdf-parse`, `mammoth`).
- **Cloud Storage Integration**: Streams resumes securely to Cloudinary with an automatic local fallback for offline development.
- **Google Gemini AI Diagnostic Pipeline**: Analyzes candidate resumes against target job descriptions using `@google/generative-ai` (`gemini-1.5-flash`), backed by a resilient heuristic fallback engine.
- **Weighted Diagnostic Score Wheel**: Custom SVG radial gauge visualizing the overall score along with a 4-pillar index:
  1. *ATS Parsability* (machine-readability & header syntax)
  2. *Keywords & Skills* (match against target role expectations)
  3. *Impact & Content* (quantifiable metrics & business outcomes)
  4. *Taxonomy & Structure* (chronology, sections, readability)
- **Skills Taxonomy & Reconciliation Matrix**: Categorized breakdown of:
  - *Validated Matching Skills* (with confidence scores)
  - *Critical Missing Requirements* (with priority level and recommendations, plus 1-click copy)
  - *Candidate Standout Highlights* (differentiator competencies)
- **ATS Parser Compliance Audit**: Heuristic checklist verifying contact details, linear reading order, section taxonomy, quantifiable KPIs, and keyword density with status filters.
- **Google X-Y-Z Actionable Bullet Rewriter**: Generates `"Accomplished [X], as measured by [Y], by doing [Z]"` formulations with side-by-side before/after diff cards and 1-click clipboard copy.
- **User Authentication & Dashboard**: JWT-based authentication (Register, Login, 1-click Demo Profile) and MongoDB persistence for audit history, aggregate stats, and report management.
- **Report Export**: Instant Printable / PDF report formatting and 1-click raw JSON export.
- **Fast Interactive Testing**: Includes a 1-click **"Load Sample Data"** button that pre-populates a realistic senior full-stack candidate CV and job description for immediate testing.

---

## ✦ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Tailwind CSS v3.4, Vite, Lucide Icons, Canvas Confetti, Axios |
| **Backend** | Node.js, Express.js, Multer, Mongoose (MongoDB), JSONWebToken, Bcrypt.js |
| **Document Parsers** | `pdf-parse`, `mammoth` |
| **Cloud Services** | Google Gemini API (`@google/generative-ai`), Cloudinary |
| **Design Language** | Obsidian/Dark Slate editorial aesthetic, low-contrast muted accents, Plus Jakarta Sans & JetBrains Mono typography |

---

## ✦ Project Structure

```
CV Analyser/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection & fallback
│   │   └── cloudinary.js         # Cloudinary stream uploader
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, demo session
│   │   └── analysisController.js # Upload, text parsing, Gemini analysis, history
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protection & optional guest auth
│   │   └── uploadMiddleware.js   # Multer memory storage & MIME validation
│   ├── models/
│   │   ├── User.js               # Mongoose User schema with bcrypt
│   │   └── Analysis.js           # Mongoose Analysis audit schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── analysisRoutes.js     # /api/analysis routes
│   ├── services/
│   │   ├── geminiService.js      # Gemini 1.5 Flash AI integration + heuristic fallback
│   │   ├── textExtractionService.js # PDF & DOCX text extraction
│   │   └── storageFallback.js    # In-memory persistence fallback
│   ├── server.js                 # Express server entry point
│   ├── .env.example              # Backend environment template
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation header & user status
│   │   │   ├── Dropzone.jsx      # File upload & text paste workspace
│   │   │   ├── ScoreGauge.jsx    # Animated SVG radial score gauge
│   │   │   ├── ExecutiveSummary.jsx # Recruiter verdict & document stats
│   │   │   ├── SkillsMatrix.jsx  # Skills matching & missing matrix
│   │   │   ├── AtsChecklist.jsx  # ATS criteria verification checklist
│   │   │   ├── StrengthsWeaknesses.jsx # Strengths and vulnerabilities
│   │   │   ├── BulletRewriter.jsx# Google X-Y-Z bullet rewrites
│   │   │   ├── AnalysisView.jsx  # Unified analysis report view
│   │   │   ├── DashboardView.jsx # History archive & performance metrics
│   │   │   ├── AuthModal.jsx     # Login / Register / Demo modal
│   │   │   ├── LoadingScreen.jsx # Multi-phase scanner animation
│   │   │   └── Toast.jsx         # Custom notifications provider
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context & session
│   │   ├── services/
│   │   │   └── api.js            # Axios client with proxy
│   │   ├── App.jsx               # Root application component
│   │   ├── index.css             # Tailwind base & custom utilities
│   │   └── main.jsx
│   ├── tailwind.config.js        # Custom design tokens & animations
│   ├── vite.config.js            # Vite config with backend proxy
│   └── package.json
│
└── README.md
```

---

## ✦ Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local daemon on `mongodb://127.0.0.1:27017` or a MongoDB Atlas cluster URI)
- *(Optional)* **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)
- *(Optional)* **Cloudinary Credentials** for live document hosting

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
```

Edit `backend/.env` with your credentials:

```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cv_analyser
JWT_SECRET=super_secret_jwt_key_curator_cv_2026_secure
JWT_EXPIRE=30d

# Google Gemini API Key (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary Configuration (Optional - falls back automatically to local store)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
# Start backend server
npm start
# Or with auto-reload:
npm run dev
```

The backend will start at `http://localhost:5000` (Healthcheck: `http://localhost:5000/api/health`).

---

### 2. Frontend Setup

In a new terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open your browser at `http://localhost:5173/`.

---

## ✦ REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate email/password, returns JWT | Public |
| `POST` | `/api/auth/demo` | Authenticate one-click demo session | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private (Bearer JWT) |

### Resume Analysis (`/api/analysis`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/analysis/analyze` | Upload resume file or paste text for Gemini audit | Public / Optional Auth |
| `GET` | `/api/analysis/sample` | Fetch pre-built sample resume and JD for testing | Public |
| `GET` | `/api/analysis/history` | Fetch analysis history for authenticated user | Private (Bearer JWT) |
| `GET` | `/api/analysis/stats` | Aggregated dashboard performance statistics | Private (Bearer JWT) |
| `GET` | `/api/analysis/:id` | Fetch single analysis record by ID | Public / Private |
| `DELETE` | `/api/analysis/:id` | Delete analysis record | Private (Bearer JWT) |

---

## ✦ Design & Aesthetics

- **Curated Palette**:
  - Canvas: `#0a0d12` (Obsidian)
  - Surface: `#131923` (Elevated Slate)
  - Borders: `rgba(255, 255, 255, 0.08)`
  - Muted Sage: `#4ade80` (Pass criteria / Matching skills)
  - Muted Amber: `#f59e0b` (Optimization recommendations)
  - Muted Rose: `#f87171` (Critical gaps / Warnings)
- **Typography**: Clean hierarchy with **Plus Jakarta Sans** for interfaces and **JetBrains Mono** for data metrics and diagnostic indicators.
- **Accessibility & Motion**: Respects reduced-motion preferences, uses high-contrast text ratios against muted backgrounds, and avoids distracting neon effects.
