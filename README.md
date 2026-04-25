# 🐾 PetPassport

A digital health & diet tracking dashboard for pets — track weight, vaccinations, daily food logs, and mood in one clean interface.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white&style=flat-square)](https://mongoosejs.com)

---

## Features

- **Dashboard** — Pet profile card, weight trend chart, stat summary, upcoming appointments
- **Daily Logs** — Log food intake, mood, and medications per day
- **Medical Records** — Vertical timeline of vet visits, vaccines & surgeries with filters

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) v6+ *(only for backend)*

---

## Getting Started

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173** — works immediately with built-in mock data, no backend needed.

---

### 2. Backend *(optional — for live data)*

```bash
cd backend
cp .env.example .env     # Windows: copy .env.example .env
npm install
npm run dev
```

Edit `.env` and set your MongoDB connection string:

```env
MONGO_URI=mongodb://localhost:27017/petpassport
PORT=5000
CLIENT_URL=http://localhost:5173
```

API runs at **http://localhost:5000**

---

## API Endpoints

| Resource | Endpoints |
|---|---|
| Pets | `GET /api/pets` · `POST /api/pets` · `GET/PUT/DELETE /api/pets/:id` |
| Weight | `POST /api/pets/:id/weight` |
| Daily Logs | `GET /api/logs?petId=` · `POST /api/logs` · `PUT/DELETE /api/logs/:id` |
| Records | `GET /api/records?petId=&status=&type=` · `POST /api/records` · `PUT/DELETE /api/records/:id` |

---

## Project Structure

```
Tpm/
├── frontend/
│   └── src/
│       ├── api/          # Axios API wrappers
│       ├── components/   # Sidebar, WeightChart, StatCard, MoodBadge, PetAvatar
│       ├── data/         # Mock data (swap with API calls to go live)
│       └── pages/        # Dashboard, DailyLogs, MedicalRecords
└── backend/
    ├── models/           # Pet, DailyLog, MedicalRecord (Mongoose)
    ├── routes/           # pets.js, logs.js, records.js
    └── server.js
```

---

## Going Live (Connecting to Backend)

The frontend uses mock data by default. To switch to real API calls, open any page file and uncomment the `useEffect` + API call block marked with:

```js
// ── Real API call (uncomment when backend is ready):
```

All Axios wrappers are pre-built in `src/api/petApi.js`.

---

## Tech Stack

| | Frontend | Backend |
|---|---|---|
| Framework | React 19 + Vite 8 | Node.js + Express 4 |
| Styling | Tailwind CSS v4 | — |
| Charts | Recharts | — |
| Database | — | MongoDB + Mongoose 8 |
| Auth / Security | — | Helmet, CORS, Morgan |

---

## License

MIT
