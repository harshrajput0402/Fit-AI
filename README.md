## 💻 Frontend

The frontend is built with **React.js** and **Vite**, providing a fast and responsive user experience. It includes secure authentication, workout and nutrition management, progress tracking, AI-powered fitness assistance, and an intuitive dashboard. The application is fully responsive and supports both light and dark themes.

**Key Features**

* JWT-based Authentication
* Interactive Dashboard
* Workout & Exercise Tracking
* Nutrition & Meal Management
* Body Progress Tracking
* Habit & Water Tracking
* AI Fitness Coach
* Weekly & Monthly Analytics
* Responsive UI
* Dark/Light Theme Support

---

## ⚙️ Backend

The backend is developed using **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**. It exposes secure RESTful APIs for authentication, user management, workouts, nutrition, analytics, and AI features. The backend uses JWT authentication, request validation, and integrates with the Groq API to provide personalized fitness recommendations.

**Key Features**

* RESTful API Architecture
* JWT Authentication & Authorization
* PostgreSQL Database with Prisma ORM
* Secure Password Hashing using bcrypt
* Input Validation with Zod
* Rate Limiting & Security Middleware
* AI Coach Integration using Groq API
* Modular MVC Project Structure
* Scalable and Maintainable Codebase






## 📡 API Routes
### Authentication

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/auth/register` |
| POST | `/api/v1/auth/login` |
| POST | `/api/v1/auth/refresh` |
| POST | `/api/v1/auth/logout` |

---

### User

| Method | Endpoint |
|--------|----------|
| GET | `/api/v1/user/me` |
| PUT | `/api/v1/user/me` |
| DELETE | `/api/v1/user/me` |

---

### Workouts

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/workouts` |
| GET | `/api/v1/workouts` |
| GET | `/api/v1/workouts/:id` |
| POST | `/api/v1/workouts/:id/exercises` |
| PUT | `/api/v1/workouts/:id/complete` |
| DELETE | `/api/v1/workouts/:id` |

---

### Nutrition

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/nutrition/meals` |
| GET | `/api/v1/nutrition/today` |
| GET | `/api/v1/nutrition/history` |
| POST | `/api/v1/nutrition/meals/:id/food` |
| DELETE | `/api/v1/nutrition/meals/:id` |

---

### Body Tracking

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/body/log` |
| GET | `/api/v1/body/history` |
| GET | `/api/v1/body/latest` |

---

### Habits

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/habits` |
| GET | `/api/v1/habits` |
| PUT | `/api/v1/habits/:id/toggle` |
| DELETE | `/api/v1/habits/:id` |

---

### Water Tracker

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/water/log` |
| GET | `/api/v1/water/today` |

---

### Analytics

| Method | Endpoint |
|--------|----------|
| GET | `/api/v1/analytics/weekly` |
| GET | `/api/v1/analytics/monthly` |

---

### AI Coach

| Method | Endpoint |
|--------|----------|
| POST | `/api/v1/ai/chat` |
