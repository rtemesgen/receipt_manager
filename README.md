# Receipt Manager

Small full-stack receipt app with React frontend and Spring Boot backend.

## Stack
- Frontend: React + Vite
- Backend: Spring Boot + Spring Security + JPA
- Database: H2 file database

## Features
- Register and login with JWT auth
- Per-user receipt settings
- Create receipts with multiple items
- View saved receipts
- Preview and print a selected receipt

## Run frontend
```powershell
cd frontend
npm install
npm run dev
```

## Run backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend uses an H2 file database and starts on `http://localhost:8080`.
The frontend expects the backend at that address.

## Test backend
```powershell
cd backend
.\mvnw.cmd test
```
