# Smart Campus - Module C

Module C implements maintenance and incident ticketing using Spring Boot + MongoDB + React + Tailwind.

## Run Backend

- `cd backend`
- `mvn spring-boot:run`
- Backend runs on `http://localhost:8081`

## Run Frontend

- `cd frontend`
- `npm install`
- `npm run dev`
- Frontend runs on `http://localhost:5173` (or Vite configured port)

## Ticket Endpoints

- `POST /api/v1/tickets` - Create ticket (USER, multipart)
- `GET /api/v1/tickets` - Get all tickets with filters (ADMIN)
- `GET /api/v1/tickets/my` - Get own tickets (USER)
- `GET /api/v1/tickets/{id}` - Get ticket details (USER/ADMIN/TECHNICIAN with access checks)
- `PUT /api/v1/tickets/{id}` - Update own OPEN ticket (USER owner)
- `DELETE /api/v1/tickets/{id}` - Delete ticket (ADMIN)
- `PATCH /api/v1/tickets/{id}/status` - Update status (ADMIN/TECHNICIAN with workflow validation)
- `PATCH /api/v1/tickets/{id}/assign` - Assign technician (ADMIN)
- `POST /api/v1/tickets/{id}/attachments` - Upload attachments (USER owner, max 3)
- `DELETE /api/v1/tickets/{id}/attachments/{filename}` - Delete attachment (OWNER or ADMIN)

## Comment Endpoints

- `POST /api/v1/tickets/{ticketId}/comments` - Add comment
- `GET /api/v1/tickets/{ticketId}/comments` - List comments
- `PUT /api/v1/tickets/{ticketId}/comments/{commentId}` - Edit own comment
- `DELETE /api/v1/tickets/{ticketId}/comments/{commentId}` - Delete comment (author or admin)

## Testing

- Backend unit tests are in `backend/src/test/java/com/smartcampus/...`
- Frontend E2E tests are in `frontend/e2e`
- Playwright config: `frontend/playwright.config.js`
- CI workflow: `.github/workflows/ci.yml`
