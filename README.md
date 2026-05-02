# 🍱 TiffinFlex — Premium Customizable Tiffin Service Platform

> A full-stack MERN web application designed to revolutionize the traditional tiffin delivery system by introducing flexibility, customization, and an elegant digital experience.

## 📌 Problem Statement
 Professionals using tiffin services receive fixed daily menus with zero flexibility. Dietary preferences, allergies, and taste preferences are often ignored. Users frequently receive meals they dislike multiple times a week but cannot modify them.

## 💡 The Solution
TiffinFlex introduces a flexible and user-centric approach to tiffin services by providing a platform where subscribers can:
* **Customize** daily meals within an active subscription
* **Swap** meals effortlessly from available menu options
* **Set dietary preferences** (vegetarian, vegan, allergies, spice levels)
* **Track Nutrition** with real-time calorie and macronutrient visualization

---

## ⚙️ Tech Stack

**Frontend Architecture:**
* **React.js 18** (UI Framework)
* **Redux Toolkit** (Global State Management)
* **Formik & Yup** (Robust Form Handling & Validation)
* **Tailwind CSS** (Utility-first Styling)
* **Framer Motion** (Cinematic Animations)
* **React Helmet Async** (Dynamic SEO)
* **React GA4** (Google Analytics)
* **Lucide React** (Iconography)

**Backend Architecture:**
* **Node.js & Express.js** (REST API)
* **MongoDB & Mongoose** (NoSQL Database)
* **JWT & Passport.js** (Authentication & Google OAuth)
* **Nodemailer** (OTP & Transactional Emails)

---

## 🚀 Key Features

### 👤 For Subscribers (Users)
* **Secure Authentication**: Email/Password + Google OAuth 2.0 integration.
* **OTP Verification**: Secure email verification for new accounts.
* **Smart Forms**: Standardized data entry with Formik, Yup validation, and session persistence.
* **Meal Swapping**: Browse daily menus and swap meals based on plan credits.
* **Premium UI**: 100% responsive design with skeleton loaders and shimmer effects.
* **Nutrition Tracker**: Data-driven health monitoring with interactive charts.

### 🛡️ For Providers (Admin)
* **Admin Dashboard**: Real-time business analytics and revenue tracking.
* **Menu Manager**: Complete CRUD for meals with inventory tracking.
* **Role Security**: Protected admin-only routes and actions.

---

## 📂 Project Structure

```text
TiffinFlex/
├── backend/                  # Express.js REST API
│   ├── config/               # DB & Passport config
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth & Validation
│   ├── models/               # Mongoose Schemas
│   ├── routes/               # API routes
│   └── services/             # Email & External services
│
├── frontend/                 # React UI (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI & Layout
│   │   ├── store/            # Redux Slices & Config
│   │   ├── hooks/            # Custom React hooks (Persistence, etc.)
│   │   ├── utils/            # Validation, Analytics, API
│   │   └── pages/            # View components
│   └── public/               # Static assets
└── README.md
```

---

## 💻 Local Setup & Installation

### 1. Clone & Install
```bash
git clone https://github.com/neev3654/tiffinFlex.git
cd tiffinFlex
# Install backend deps
cd backend && npm install
# Install frontend deps
cd ../frontend && npm install
```

### 2. Environment Variables
Create `.env` in `backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

Create `.env` in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Development
```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm run dev
```

---

## 🌐 SEO & Analytics
* **SEO**: Every page features dynamic titles and meta descriptions via `react-helmet-async`.
* **Analytics**: Google Analytics 4 (GA4) integrated to track user journeys and conversion events (signups, meal swaps).

---

## 🎨 UI/UX Design
* Initial UI wireframing and conceptualization designed in Figma.
* [Figma Design Reference Link](https://www.figma.com/design/dFyEuSN5vcs57WZQup2XO8/Untitled?node-id=14-3&t=FVQOA6rq9WHwTOUw-1)

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
