# 🚀 NestJS + PostgreSQL Setup Guide

## ✅ Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running
- npm (or yarn)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YatamCharishma/TruckManagementBackend.git
cd TruckManagementBackend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```env
PGHOST=localhost
PGPORT=5432
PGDATABASE=your_database_name
PGUSER=your_db_user
PGPASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
PORT=3000
```

> Make sure your PostgreSQL server is running and the credentials match an existing database.

---

## ▶️ Run the Application

Start the server in development mode:

```bash
npm run start:dev
```

Visit the app at:

```
http://localhost:3000
```

---

## 📜 Available Scripts

```bash
# Start in development mode
npm run start:dev

# Build for production
npm run build

# Start in production mode
npm run start:prod
```

---

## 📝 Notes

- This app uses `pg-promise` (no ORM).
- JWT is used for authentication.
- Ensure PostgreSQL is up and credentials are correct before running the app.
