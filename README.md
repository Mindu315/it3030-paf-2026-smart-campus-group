# Smart Campus (IT3030 / PAF 2026)

Monorepo for the Smart Campus system (Spring Boot + MongoDB backend, React + Vite frontend).

## Features

- Authentication: email/password + Google Sign-In (JWT-based)
- Roles: `USER`, `ADMIN`
- Resource catalog + filtering (rooms/equipment)
- Bookings + booking review flow
- Maintenance/incident tickets (attachments + status workflow) + comments
- Notifications (recent, unread count, mark-as-read)

## Tech Stack

- Backend: Java 21, Spring Boot 3, Spring Security, MongoDB
- Frontend: React, Vite, TailwindCSS, Axios, React Router
- Testing: JUnit (backend), Playwright (frontend e2e)

## Prerequisites

- Java 21 (for the Spring Boot backend)
- Node.js (LTS recommended) + npm (for the React frontend)
- MongoDB (local or Atlas). Update the connection string in `backend/src/main/resources/application.properties`.

## Project Structure

- `backend/` Spring Boot API (MongoDB)
- `frontend/` React app (Vite + Tailwind)

## Quick Start

### 1) Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

- API base: `http://localhost:8080`
- Uploads are served from: `http://localhost:8080/uploads/**`

### 2) Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

- App runs on: `http://localhost:3000`

## Configuration

### Backend

Backend defaults live in `backend/src/main/resources/application.properties`.

Common settings:

- `spring.data.mongodb.uri` (MongoDB connection string)
- `SMARTCAMPUS_JWT_SECRET` (required)
- `SMARTCAMPUS_JWT_EXP_SECONDS` (defaults to `86400`)

### Google Login

- Frontend requires `VITE_GOOGLE_CLIENT_ID` (used by `@react-oauth/google`).
- Backend currently verifies Google ID tokens against a configured audience inside `backend/src/main/java/com/smartcampus/user/UserService.java` (update it to match your Google OAuth Client ID).

## API Overview

### Auth

- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/google-login`
- `POST /api/admin/login` (default credentials are hardcoded in `backend/src/main/java/com/smartcampus/admin/AdminAuthController.java`)

### Tickets

- `POST /api/v1/tickets` (multipart; optional `attachments[]`)
- `GET /api/v1/tickets` (filters: `status`, `priority`, `category`, `technicianId`, `page`, `size`)
- `GET /api/v1/tickets/my`
- `GET /api/v1/tickets/{id}`
- `PUT /api/v1/tickets/{id}`
- `DELETE /api/v1/tickets/{id}`
- `PATCH /api/v1/tickets/{id}/status`
- `PATCH /api/v1/tickets/{id}/assign`
- `POST /api/v1/tickets/{id}/attachments`
- `DELETE /api/v1/tickets/{id}/attachments/{filename}`

### Ticket Comments

- `POST /api/v1/tickets/{ticketId}/comments`
- `GET /api/v1/tickets/{ticketId}/comments`
- `PUT /api/v1/tickets/{ticketId}/comments/{commentId}`
- `DELETE /api/v1/tickets/{ticketId}/comments/{commentId}`

### Resources

- `POST /api/resources`
- `GET /api/resources`
- `GET /api/resources/{id}`
- `PUT /api/resources/{id}`
- `DELETE /api/resources/{id}`
- `GET /api/resources/filter` (optional: `type`, `location`, `minCapacity`, `status`)

### Bookings

- `POST /api/bookings/add`
- `PUT /api/bookings/{id}/status`
- `GET /api/bookings/pending`
- `GET /api/bookings/all`
- `GET /api/bookings/student/{studentId}`
- `GET /api/bookings/student/{studentId}/pending`
- `DELETE /api/bookings/{id}`

### Notifications

- `GET /api/notifications/student/{studentId}`
- `GET /api/notifications/recent`
- `GET /api/notifications/unread-count/{studentId}`
- `PUT /api/notifications/read/{id}`

### Debug

- `GET /api/debug/mongo`

## Auth Notes (Frontend ↔ Backend)

- Frontend stores the JWT in `localStorage` and sends it as `Authorization: Bearer <token>`.
- Frontend also sends `X-User-Id`, `X-User-Email`, and `X-User-Role` headers (used by backend helpers).

## Testing

### Backend

```bash
cd backend
./mvnw test
```

### Frontend

```bash
cd frontend
npm run lint
npx playwright test
```

## Troubleshooting

- If you want to use Vite's `/api` proxy, update `frontend/vite.config.js` to target your backend port (backend defaults to `8080`).
