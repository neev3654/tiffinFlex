# 🍱 TiffinFlex

> A premium, full-stack MERN web application designed to revolutionize the traditional tiffin delivery system by introducing flexibility, complete dietary customization, and an elegant digital experience.

## 📎 Important Links

| Resource | Link |
|----------|------|
| **Figma Design** | [View Figma Mockups](https://www.figma.com/design/dFyEuSN5vcs57WZQup2XO8/Untitled?node-id=14-3&t=FVQOA6rq9WHwTOUw-1) |
| **Live Project** | [View Deployed Frontend](https://tiffin-flex.vercel.app) |
| **Backend API** | [View Deployed Backend](https://tiffinflex.onrender.com) |
| **Postman Docs** | [View API Documentation](#) *(Add Link Here)* |
| **YouTube Demo** | [Watch Project Demo](#) *(Add Link Here)* |

---

## 📌 Problem Statement
Professionals using tiffin services receive fixed daily menus with zero flexibility. Dietary preferences, allergies, and taste preferences are often ignored. Users frequently receive meals they dislike multiple times a week but cannot modify them, leading to food waste and poor customer satisfaction.

## 💡 Solution
TiffinFlex introduces a flexible and user-centric approach to tiffin services by providing a platform where subscribers can:
* **Customize** daily meals within an active subscription based on their plan credits.
* **Swap** meals effortlessly from a wide variety of available menu options.
* **Set precise dietary preferences** (vegetarian, vegan, allergies, spice levels).
* **Track Nutrition** with real-time calorie and macronutrient visualization.

---

## 🚀 Features

### 👤 For Subscribers (Users)
* **Secure Authentication**: Email/Password + Google OAuth 2.0 integration.
* **OTP Verification**: Secure email verification for new accounts via Resend API.
* **Dynamic Dashboard**: View weekly schedules, streak counts, and health scores.
* **Meal Swapping**: Browse daily menus and swap meals instantly.
* **Nutrition Tracker**: Data-driven health monitoring with interactive UI.

### 🛡️ For Providers (Admin)
* **Admin Dashboard**: Real-time business analytics and revenue tracking.
* **Menu Manager**: Complete CRUD operations for daily meals backed by MongoDB.
* **Role Security**: Protected admin-only routes and actions via JWT.

---

## ⚙️ Tech Stack

**Frontend**
* **React.js 18** (UI Framework)
* **Redux Toolkit** (Global State Management)
* **Formik & Yup** (Robust Form Handling & Validation)
* **Tailwind CSS** (Utility-first Styling)
* **Framer Motion** (Cinematic Animations)
* **React Helmet Async** (Dynamic SEO)
* **React GA4** (Google Analytics)

**Backend**
* **Node.js & Express.js** (REST API)
* **MongoDB & Mongoose** (NoSQL Database)
* **JWT & Passport.js** (Authentication & Google OAuth)
* **Resend API** (Transactional OTP Emails)

---

## 📂 Proper Folder Structure

```text
TiffinFlex/
├── backend/                  # Express.js REST API
│   ├── config/               # Database config
│   ├── controllers/          # Business logic (Auth, Meals)
│   ├── data/                 # Seed scripts
│   ├── middleware/           # Auth & Role Validation
│   ├── models/               # Mongoose Schemas
│   ├── routes/               # API routes
│   └── server.js             # Main application entry point
│
├── frontend/                 # React UI (Vite)
│   ├── public/               # Static assets, sitemap.xml, robots.txt
│   ├── src/
│   │   ├── components/       # Reusable UI & Layouts
│   │   ├── context/          # React Contexts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Main view components
│   │   ├── store/            # Redux Slices
│   │   └── utils/            # Validation schemas, API interceptors
│   ├── index.html            # Main HTML with SEO meta tags
│   └── vite.config.js        # Vite configuration
└── README.md
```

---

## 📸 Project Screenshots

*(Add your screenshots here)*

> Example structure:
> ```markdown
> ![Landing Page](./frontend/public/screenshots/landing.png)
> ![Dashboard](./frontend/public/screenshots/dashboard.png)
> ```

---

## 🌐 SEO Implementation
This project adheres to modern technical SEO standards:
* **Dynamic Meta Tags**: Implemented via `react-helmet-async` for route-specific titles and descriptions.
* **Sitemaps & Robots**: Custom `sitemap.xml` and `robots.txt` ensuring search engines crawl the site effectively.
* **Semantic HTML**: Proper heading hierarchies and ARIA labels.
* **Google Analytics**: Integrated GA4 for user event tracking.

---

## 💻 Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/neev3654/tiffinFlex.git
cd tiffinFlex
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env variables (MongoDB, JWT, Resend, Google OAuth)
npm run dev
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
cp .env.example .env
# Make sure VITE_API_URL points to your backend
npm run dev
```
