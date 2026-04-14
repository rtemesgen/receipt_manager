# Receipt Manager

Receipt Manager is a small full-stack application built from a client-style request to demonstrate practical implementation, clear code structure, and the ability to understand and extend AI-assisted work.

The app allows a user to register, log in, manage receipt settings, create receipts, preview them, print them, and manage saved receipts. It was built with React on the frontend, Spring Boot on the backend, and H2 for simple local persistence.

## Project Summary
This project was created in response to a simple client requirement:
- basic login
- enter receipt information
- update receipt settings such as address
- use vibe coding while still understanding the resulting codebase

The final implementation covers those requested features and extends them with:
- user registration
- saved receipt history
- edit and delete actions
- receipt preview
- browser printing
- user-specific business settings
- optional logo support on receipts

## Tech Stack
- Frontend: React + Vite
- Backend: Spring Boot + Spring Security + JPA
- Database: H2 file database
- Authentication: JWT-based login

## Features
- Register and log in with email and password
- Store user-specific receipt settings
- Update business name, address, phone, footer message, website, tax ID, and logo URL
- Create receipts with multiple line items
- View saved receipts
- Edit and delete receipts
- Preview receipts before printing
- Print a selected receipt from the browser

## Why This Project Matters
This project demonstrates:
- turning a short client prompt into a working full-stack product
- breaking a feature request into frontend, backend, and persistence concerns
- building understandable code instead of only generating code quickly
- handling user flows such as authentication, CRUD operations, settings, and printing
- iterating on UI and UX based on feedback

## Application Flow
1. A user registers or logs in.
2. The user saves business receipt settings.
3. The user creates a receipt with customer and item details.
4. The receipt is saved and shown in preview mode.
5. The user can print, edit, or delete saved receipts.

For a full end-user walkthrough, see [USER_GUIDE.md](./USER_GUIDE.md).

## Running The Project
### Backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend URL:
- `http://localhost:8080`

### Frontend
```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:
- `http://localhost:5173`

## Testing
### Backend tests
```powershell
cd backend
.\mvnw.cmd test
```

### Frontend build check
```powershell
cd frontend
npm run build
```

## Repository Structure
- `frontend/` React UI and client-side flows
- `backend/` Spring Boot API, authentication, business logic, and persistence
- `USER_GUIDE.md` user-side instructions
- `docs/` supporting documentation for presentation and maintenance

## Suggested Recruiter Talking Points
- Built from a real client-style prompt rather than a pre-defined tutorial.
- Covers authentication, CRUD, settings management, print workflow, and UI iteration.
- Uses a clean separation between frontend and backend.
- Demonstrates both delivery speed and code comprehension.

## Screenshots
Add screenshots to `docs/screenshots/` and reference them here.
Recommended screenshots:
- login page
- receipt dashboard
- settings page
- receipt preview
- print preview

See [docs/SCREENSHOTS.md](./docs/SCREENSHOTS.md) for a simple checklist.
