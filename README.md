# 🍱 TiffinFlex — Premium Customizable Tiffin Service Platform

> A full-stack MERN web application designed to revolutionize the traditional tiffin delivery system by introducing flexibility, customization, and an elegant digital experience.

## 📌 Problem Statement
**"Why can't tiffin subscribers customize daily meals?"**

Professionals using tiffin services receive fixed daily menus with zero flexibility. Dietary preferences, allergies, and taste preferences are often ignored. Users frequently receive meals they dislike multiple times a week but cannot modify them. Cancelling subscriptions leads to wasted money and food. Currently, there is no system that enables daily meal customization while maintaining the benefits of a predictable subscription model.

## 💡 The Solution
TiffinFlex introduces a flexible and user-centric approach to tiffin services by providing a platform where subscribers can:
* **Customize** daily meals within an active subscription
* **Swap** meals effortlessly from available menu options
* **Set dietary preferences** (vegetarian, vegan, allergies, spice levels)
* **Track Nutrition** with real-time calorie and macronutrient visualization
* **Retain** affordable subscription pricing while enjoying restaurant-level flexibility

---

## ⚙️ Tech Stack

**Frontend Architecture:**
* **React.js 18** (UI Framework)
* **Tailwind CSS** (Utility-first Styling)
* **Framer Motion** (Cinematic Animations & Page Transitions)
* **React Router v6** (Protected & Role-based Routing)
* **Lucide React** (Modern Iconography)
* **Recharts** (Data Visualization for Nutrition & Admin Dashboards)

**Backend Architecture:**
* **Node.js & Express.js** (REST API)
* **MongoDB & Mongoose** (NoSQL Database & ODM)
* **JWT (JSON Web Tokens)** (Secure Authentication)
* **Bcrypt.js** (Password Hashing)
* **Cors & Dotenv** (Security & Environment Config)

---

## 🚀 Key Features

### 👤 For Subscribers (Users)
* **Robust Authentication**: Secure Login/Signup with personalized onboarding (Diet, Allergies, Plan selection).
* **Tiered Subscriptions**: Choose between Starter, Regular, and Pro plans with Monthly or Annual (20% off) billing cycles.
* **Meal Swapping Engine**: Browse the daily menu and swap scheduled meals based on remaining swap credits.
* **Nutrition Tracker**: Interactive Recharts pie/bar charts tracking daily calorie and macro intake.
* **Refer & Earn System**: Progress-bar driven referral system to unlock free subscription weeks.
* **Simulated Payments**: Razorpay-style checkout UI with coupon code validation and success/error state management.
* **Theme Customization**: Seamless toggle between "Spice Market" (Dark Mode) and "Vanilla Cream" (Light Mode).

### 🛡️ For Providers (Admin)
* **Role-Based Access Control**: Secure `/admin` routes explicitly locked down to admin accounts.
* **Analytics Dashboard**: View aggregate data like Total Revenue, Meals Served, Cancellations, and Subscriber count.
* **Revenue Trend Charts**: Visualize weekly revenue streams via interactive charts.
* **Menu Manager (CRUD)**: Easily Add, Edit, Delete, and track inventory for all available meals on the platform.
* **Live Order Tracking**: Monitor the status of daily meal dispatch operations.

---

## 📂 Project Structure

```text
TiffinFlex/
├── backend/                  # Express.js REST API
│   ├── config/               # Database connection (db.js)
│   ├── controllers/          # Business logic (authController.js)
│   ├── data/                 # Seed scripts (seedAdmin.js)
│   ├── middleware/           # JWT & Error handlers
│   ├── models/               # Mongoose Schemas (User.js)
│   ├── routes/               # API endpoint definitions
│   └── server.js             # Entry point
│
├── frontend/                 # React UI
│   ├── public/               # SEO meta tags, Favicon, Manifest
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, Modals, Stats, ErrorBoundary)
│   │   ├── context/          # React Context (AuthContext, ThemeContext, Notifications)
│   │   ├── data/             # Static dummy data for frontend presentation
│   │   ├── pages/            # View components (Dashboard, Subscription, Admin Dashboard)
│   │   ├── utils/            # Axios API config
│   │   ├── App.js            # Routing, Lazy Loading, and Context Providers
│   │   └── index.css         # Tailwind directives and CSS variables (Themes)
│   ├── tailwind.config.js    # Design system tokens
│   └── vercel.json           # Deployment config
└── README.md
```

---

## 💻 Local Setup & Installation

### Prerequisites
* Node.js (v16+)
* MongoDB (Local or Atlas)
* Git

### 1. Clone the Repository
```bash
git clone https://github.com/neev3654/tiffinFlex.git
cd tiffinFlex
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create a .env file in the backend root
echo "PORT=5000" > .env
echo "MONGO_URI=your_mongodb_connection_string_here" >> .env
echo "JWT_SECRET=your_super_secret_jwt_key_here" >> .env

# Run the server
npm start
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install

# Start the React development server
npm start
```

### 4. Admin Account Seeding
To access the Admin Dashboard, run the seed script from the backend folder:
```bash
cd backend
node data/seedAdmin.js
```
*Login Credentials:* `admin@tiffinflex.com` / `admin123`

---

## 🌐 Deployment Guide

### Frontend (Vercel)
1. Push your code to GitHub.
2. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import the `tiffinFlex` repository.
4. Set the **Root Directory** to `frontend`.
5. The `vercel.json` file is already configured to support React Router. Click **Deploy**.

### Backend (Render)
1. Log into [Render](https://render.com/) and create a new **Web Service**.
2. Connect your GitHub repository and set the **Root Directory** to `backend`.
3. Set the **Build Command** to `npm install` and **Start Command** to `node server.js`.
4. Add the Environment Variables (`MONGO_URI`, `JWT_SECRET`, `PORT`).
5. Click **Deploy**. *(Don't forget to update the `API_URL` in `frontend/src/utils/api.js` to your new Render URL).*

---

## 🎨 UI/UX Design

* Initial UI wireframing and conceptualization designed in Figma.
* [Figma Design Reference Link](https://www.figma.com/design/dFyEuSN5vcs57WZQup2XO8/Untitled?node-id=14-3&t=FVQOA6rq9WHwTOUw-1)

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
