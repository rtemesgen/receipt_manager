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

## 3. Render PostgreSQL setup
Create a PostgreSQL database in Render first.
Render will give you connection details such as host, port, database name, username, and password.

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
Render often gives PostgreSQL details in standard Postgres format, but Spring Boot JDBC should use:
- `jdbc:postgresql://...`

So if you see a non-JDBC URL from Render, convert it to JDBC form.

## 4. Local development with H2
For local work, you can keep using H2.

### Backend local steps
```powershell
cd backend
copy .env.example .env
.\mvnw.cmd spring-boot:run
```

If you keep the default `.env.example` values, the backend runs with H2.

## 5. Local development with PostgreSQL
If you want local PostgreSQL instead of H2:
- copy `backend/.env.example` to `backend/.env`
- replace the DB values with your PostgreSQL connection info
- start the backend normally

## 6. Suggested Render service settings
### Backend service
- Runtime: Java
- Root directory: `backend`
- Build command: `./mvnw clean package`
- Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

If Render on Windows-style docs shows Unix shell commands, use the Render dashboard values exactly as Linux commands there.

### Frontend on Vercel
- Root directory: `frontend`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## 7. Deployment order
1. Create PostgreSQL on Render.
2. Deploy backend on Render with PostgreSQL env vars.
3. Confirm backend is live.
4. Deploy frontend on Vercel.
5. Set `VITE_API_BASE_URL` to the Render backend URL.
6. Redeploy frontend if needed.

## 8. Files added for env support
- `frontend/.env.example`
- `backend/.env.example`

These are templates only.
Do not commit real `.env` files with secrets.
