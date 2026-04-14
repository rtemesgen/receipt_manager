# Deployment Guide

This project is prepared for:
- frontend on Vercel
- backend on Render
- PostgreSQL on Render

## 1. Frontend on Vercel
The frontend reads its API URL from:
- `VITE_API_BASE_URL`

### Local example
```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

### Vercel environment variable
Set this in Vercel:
- `VITE_API_BASE_URL=https://your-backend-service.onrender.com`

Vercel uses Vite environment variables with the `VITE_` prefix.

## 2. Backend on Render
The backend supports both:
- H2 locally by default
- PostgreSQL online through environment variables

It reads these variables:
- `DATABASE_URL`
- `DATABASE_DRIVER`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JPA_DDL_AUTO`
- `H2_CONSOLE_ENABLED`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `PORT`

## 3. Create PostgreSQL on Render
1. In Render, click `New +`.
2. Choose `PostgreSQL`.
3. Create the database in the same region as your backend.
4. Copy the host, port, database name, username, and password.

In your Render backend service, set environment variables like this:
- `DATABASE_URL=jdbc:postgresql://YOUR_HOST:5432/YOUR_DB?sslmode=require`
- `DATABASE_DRIVER=org.postgresql.Driver`
- `DATABASE_USERNAME=YOUR_USERNAME`
- `DATABASE_PASSWORD=YOUR_PASSWORD`
- `JPA_DDL_AUTO=update`
- `H2_CONSOLE_ENABLED=false`
- `JWT_SECRET=your-long-random-secret`
- `JWT_EXPIRATION_MS=86400000`

Important:
- Render may also show a standard Postgres connection string.
- Spring Boot should use the JDBC form: `jdbc:postgresql://...`

## 4. Deploy backend on Render with Docker
Render's native build environment is not a reliable fit for this Spring Boot app. Use a Docker web service for the backend.

### Backend service settings
- Service type: `Web Service`
- Environment: `Docker`
- Root directory: `backend`
- Dockerfile path: `./Dockerfile`

You do not need a separate build command or start command when using Docker. Render will use the Dockerfile.

### Why Docker
This avoids `JAVA_HOME` and runtime-detection issues and gives you a consistent Java 17 environment for Spring Boot.

## 5. Local development with H2
For local work, you can keep using H2.

### Backend local steps
```powershell
cd backend
copy .env.example .env
.\mvnw.cmd spring-boot:run
```

If you keep the default `.env.example` values, the backend runs with H2.

## 6. Local development with PostgreSQL
If you want local PostgreSQL instead of H2:
- copy `backend/.env.example` to `backend/.env`
- replace the DB values with your PostgreSQL connection info
- start the backend normally

## 7. Frontend on Vercel
### Frontend service settings
- Root directory: `frontend`
- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Set:
- `VITE_API_BASE_URL=https://your-backend-service.onrender.com`

## 8. Deployment order
1. Create PostgreSQL on Render.
2. Deploy backend on Render as a Docker web service.
3. Add the PostgreSQL and JWT environment variables.
4. Confirm backend is live.
5. Deploy frontend on Vercel.
6. Set `VITE_API_BASE_URL` to the Render backend URL.
7. Redeploy frontend if needed.

## 9. Files added for deployment
- `frontend/.env.example`
- `backend/.env.example`
- `backend/Dockerfile`
- `backend/.dockerignore`

These are templates only.
Do not commit real `.env` files with secrets.
