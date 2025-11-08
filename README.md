# PDF Annotation — Backend

This document describes how to set up, run and understand the backend service for the PDF Annotation project.

## Project summary

The backend is an Express.js API that provides authentication, document upload (stored in GridFS), annotation CRUD, and admin utilities. It follows a controller -> service pattern for request handling.

## Project setup and run instructions

Prerequisites:

- Node.js (16+ recommended)
- MongoDB instance (local or Atlas)

Steps:

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in `/backend` (example):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pdf-annotation
JWT_SECRET=your_jwt_secret_here
BASE_URL=http://localhost:5000
# Other optional variables
```

3. Run in development (auto-restarts with nodemon):

```bash
npm run dev
```

Or run production:

```bash
npm start
```

4. API docs (Swagger)

After the server starts you can view interactive API docs at:

```
http://localhost:5000/api-docs
```

## Folder structure

Important files and folders:

- `server.js` — Express app entrypoint.
- `config/db.js` — MongoDB connection helper.
- `config/swagger.js` — Swagger (OpenAPI) configuration.
- `routes/` — Express route definitions (grouped by domain).
- `controller/` — Controllers: receive request, call services, send responses.
- `service/` — Business logic and data access helpers.
- `models/` — Mongoose models (User, Document, Annotation, etc.).
- `middleware/` — Auth middleware, error handler, file upload helpers.

Example tree (trimmed):

```
backend/
├─ controller/
├─ models/
├─ routes/
├─ service/
├─ config/
├─ middleware/
└─ server.js
```

## Technology stack used

- Node.js + Express
- MongoDB + Mongoose
- GridFS (via `gridfs-stream` / `multer-gridfs-storage`) for file storage
- JWT (`jsonwebtoken`) for authentication
- `bcryptjs` for password hashing
- Swagger (swagger-jsdoc + swagger-ui-express) for API docs

## Environment variables

- `MONGODB_URI` — MongoDB connection string
- `PORT` — port to run the server on (default 5000)
- `JWT_SECRET` — secret used for signing JWT tokens
- `BASE_URL` — (optional) base URL used when returning file URLs

## API endpoints

Base path: `/api`

Auth

- `POST /api/auth/register` — register new user

  - body: `{ email, password, name, userType }`
  - returns: `{ message, token, user }`

- `POST /api/auth/login` — login

  - body: `{ email, password }`
  - returns: `{ message, token, user }`

- `GET /api/auth/me` — get current user
  - auth: Bearer JWT
  - returns: `{ user }`

Users

- `GET /api/users/profile` — get current user's profile

  - auth: Bearer JWT

- `PATCH /api/users/profile` — update current user's profile
  - auth: Bearer JWT
  - body: `{ name }`

Documents

- `GET /api/documents` — list active documents

  - auth: Bearer JWT

- `POST /api/documents/upload` — upload a PDF (multipart/form-data)

  - auth: Bearer JWT
  - form fields: `title`, `description`, `file` (binary PDF)
  - stores file in GridFS and creates a `Document` record

- `GET /api/documents/:docId/file` — stream / download the PDF file

Annotations

- `GET /api/annotations/document/:docId` — get document and its annotations

  - returns: `{ document, annotations }`

- `POST /api/annotations` — create new annotation

  - auth: Bearer JWT
  - body: `{ document, page, type, content, color, coordinates }`

- `POST /api/annotations/:id/reply` — add reply to an annotation

  - auth: Bearer JWT
  - body: `{ content }`

- `PUT /api/annotations/:id` — update annotation

  - auth: Bearer JWT
  - body: `{ content, color, userId }`

- `DELETE /api/annotations/:id` — delete annotation
  - auth: Bearer JWT

Admin (example)

- `GET /api/admin/...` — admin utilities (manage users, documents). Check `routes/admin.js` for current endpoints.

## Annotation logic (how annotations work)

- Annotations are saved in the `Annotation` model and reference a `Document` and a `User`.
- Typical annotation payload:

```json
{
  "document": "<documentId>",
  "page": 2,
  "type": "highlight|note|shape",
  "content": "Highlighted text or note content",
  "color": "#f59e0b",
  "coordinates": { "x": 10, "y": 20, "w": 200, "h": 40 }
}
```

- Replies: annotations contain a `replies` array (subdocuments). Adding a reply pushes `{ user: req.user._id, content }` into `replies` and returns the populated annotation.
- Permissions: The code contains placeholders to check whether a user has permission to annotate (owner or permission list). At present these checks are commented out — you can enforce them by enabling the permission checks in `routes/annotations.js` or in a service layer.

## Developer notes

- File uploads use GridFS and `multer-gridfs-storage`. Ensure `MONGODB_URI` is correct and GridFS bucket is initialized.
- The project uses a controller-service split (see `controller/` and `service/`). Keep business logic in `service/` and HTTP specifics in `controller/`.
- Swagger UI is mounted at `/api-docs` once `swagger-jsdoc` scans your annotated routes.

## Troubleshooting

- If file streaming returns `GridFSBucket not initialized`, ensure MongoDB connection is established and the server restarted.
- If auth fails, check `JWT_SECRET` and token generation logic in `service/authService.js`.

---
