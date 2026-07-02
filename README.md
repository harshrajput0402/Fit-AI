# 🏋️ FitAI

An AI-powered full-stack fitness tracking web application that helps users manage workouts, nutrition, body progress, habits, and water intake while receiving personalized fitness guidance through an AI Coach.

---

## 🌐 Live Demo

| Service | Link |
|---------|------|
| Frontend | https://fitai-sage.vercel.app/ |


---

# 📖 About the Project

FitAI is a modern fitness management platform built using the MERN ecosystem with PostgreSQL and Prisma. Users can securely manage their fitness journey by tracking workouts, meals, body measurements, water intake, and daily habits. The application also includes an AI Coach powered by Groq's Llama model that provides personalized fitness and nutrition recommendations.

---

# ✨ Features

- 🔐 JWT Authentication
- 🏋️ Workout Tracker
- 🥗 Nutrition Tracker
- 📈 Body Progress Tracking
- 💧 Water Intake Tracker
- ✅ Habit Tracker
- 🤖 AI Fitness Coach
- 📊 Weekly & Monthly Analytics
- 🌙 Dark & Light Theme
- 📱 Fully Responsive Design

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- React Router
- CSS
- Fetch API

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation
- bcryptjs
- Groq AI
- Helmet
- CORS

---

# 📂 Project Structure

```
FitAI/
│
├── frontend/
│
├── backend/
│
├── README.md
│
└── .gitignore
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/harshrajput0402/Fit-AI

cd Fit-AI
```

---

## Backend Setup

```bash
cd FitAI-backend-main

npm install
```

Create a `.env` file.

```env
DATABASE_URL=your_database_url

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

GROQ_API_KEY=your_groq_api_key

FRONTEND_URL=http://localhost:5173
```

Generate Prisma Client

```bash
npx prisma generate
```

Push Database

```bash
npx prisma db push
```

Start Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd FitAI-frontend-main

npm install
```

Create a `.env` file.

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start Frontend

```bash
npm run dev
```

---

# 💻 Frontend

The frontend is built using **React.js** and **Vite**, providing a fast, responsive, and user-friendly interface. It enables users to manage workouts, nutrition, habits, body progress, and interact with the AI Coach through a modern dashboard.

### Features

- JWT Authentication
- Interactive Dashboard
- Workout Management
- Nutrition Tracking
- Body Progress Tracking
- Habit Tracking
- Water Intake Tracking
- AI Chat Interface
- Weekly & Monthly Analytics
- Responsive UI
- Dark & Light Theme

---

# ⚙️ Backend

The backend is built with **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**. It provides secure REST APIs for authentication, user management, workouts, nutrition, analytics, and AI integration.

### Features

- RESTful APIs
- JWT Authentication & Authorization
- Prisma ORM
- PostgreSQL Database
- Password Hashing
- Request Validation using Zod
- Rate Limiting
- Security Middleware
- Groq AI Integration
- MVC Architecture

---

# 📡 API Routes

## Authentication

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/auth/register` |
| POST | `/api/v1/auth/login` |
| POST | `/api/v1/auth/refresh` |
| POST | `/api/v1/auth/logout` |

---

## User

| Method | Endpoint |
|--------|----------|
| GET | `/api/v1/user/me` |
| PUT | `/api/v1/user/me` |
| DELETE | `/api/v1/user/me` |

---

## Workouts

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/workouts` |
| GET | `/api/v1/workouts` |
| GET | `/api/v1/workouts/:id` |
| POST | `/api/v1/workouts/:id/exercises` |
| PUT | `/api/v1/workouts/:id/complete` |
| DELETE | `/api/v1/workouts/:id` |

---

## Nutrition

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/nutrition/meals` |
| GET | `/api/v1/nutrition/today` |
| GET | `/api/v1/nutrition/history` |
| POST | `/api/v1/nutrition/meals/:id/food` |
| DELETE | `/api/v1/nutrition/meals/:id` |

---

## Body Tracking

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/body/log` |
| GET | `/api/v1/body/history` |
| GET | `/api/v1/body/latest` |

---

## Habits

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/habits` |
| GET | `/api/v1/habits` |
| PUT | `/api/v1/habits/:id/toggle` |
| DELETE | `/api/v1/habits/:id` |

---

## Water Tracker

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/water/log` |
| GET | `/api/v1/water/today` |

---

## Analytics

| Method | Endpoint |
|--------|----------|
| GET | `/api/v1/analytics/weekly` |
| GET | `/api/v1/analytics/monthly` |

---

## AI Coach

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/ai/chat` |

---

# 🚀 Deployment

### Backend

Deploy on **Render**

```bash
Build Command:
npm install && npx prisma generate
```

```bash
Start Command:
node server.js
```

---

### Frontend

Deploy on **Vercel**

Environment Variable

```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

---

# 📦 Available Scripts

## Backend

```bash
npm run dev

npm start

npx prisma studio

npx prisma generate

npx prisma db push
```

## Frontend

```bash
npm run dev

npm run build

npm run preview
```

---

# 👨‍💻 Author

**Harsh Rajput**

Built as a full-stack learning project using React, Node.js, Express, PostgreSQL, Prisma, and Groq AI.

⭐ If you like this project, don't forget to star the repository!
