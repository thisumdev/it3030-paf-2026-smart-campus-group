# Smart Campus Operations Hub

**IT3030 – Programming Applications & Frameworks**

> A full-stack web platform for managing university facility bookings,
> maintenance tickets, and campus operations.

---

## Team Members & Modules

| Member   | Module                        | Responsibility                          |
| -------- | ----------------------------- | --------------------------------------- |
| Member 1 | Facilities & Assets Catalogue | Resource management endpoints           |
| Member 2 | Booking & Workflow            | Booking lifecycle & conflict checking   |
| Member 3 | Ticketing & Maintenance       | Incident tickets & attachments          |
| Member 4 | Security & Communications     | OAuth2, Role management & Notifications |

---

## Tech Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| Backend         | Java 22, Spring Boot 4.0.3       |
| Frontend        | React 19, Vite, Tailwind CSS     |
| Database        | SQLite                           |
| Auth            | OAuth 2.0 (Google Sign-in) + JWT |
| Version Control | Git + GitHub Actions             |

---

### Prerequisites

- Java 22+
- Node.js 18+
- Git

Backend runs on → http://localhost:8080

Frontend runs on → http://localhost:5173

---

## Git Branching Strategy

```
main          ← stable, protected, integration branch (requires PR review)

feature/module1-facilities
feature/module2-bookings
feature/module3-tickets
feature/module4-auth-notifications
```

### Branch Rules

- ❌ No direct push to `main`
- ✅ All merges to `main` require **at least 1 reviewer approval**
- ✅ All merges go through `develop` first then to `main`

---

## API Endpoints

### Member 1 — Facilities & Assets Catalogue

> _To be updated by Member 1_

### Member 2 — Booking & Workflow

> _To be updated by Member 2_

### Member 3 — Ticketing & Maintenance

> _To be updated by Member 3_

### Member 4 — Security & Communications

| Method   | Endpoint               | Auth    | Status | Description                      |
| -------- | ---------------------- | ------- | ------ | -------------------------------- |
| `POST`   | `/api/users/register`  | Public  | 201    | Register new user                |
| `POST`   | `/api/users/login`     | Public  | 200    | Login, returns JWT               |
| `GET`    | `/api/users/me`        | Any JWT | 200    | Get own profile                  |
| `GET`    | `/api/users`           | ADMIN   | 200    | List all users (`?role=` filter) |
| `GET`    | `/api/users/{id}`      | ADMIN   | 200    | Get user by ID                   |
| `PUT`    | `/api/users/{id}/role` | ADMIN   | 200    | Update user role                 |
| `DELETE` | `/api/users/{id}`      | ADMIN   | 204    | Delete user                      |

---

## ✅ Implementation Progress

### Member 1 — Facilities & Assets Catalogue

> _To be updated by Member 1_

### Member 2 — Booking & Workflow

> _To be updated by Member 2_

### Member 3 — Ticketing & Maintenance

> _To be updated by Member 3_

### Member 4 — Security & Communications

**Backend**

- [x] User registration with BCrypt password encoding
- [x] JWT login with role-based claims
- [x] Google OAuth 2.0 sign-in
- [x] Role-based access control (`USER`, `ADMIN`, `TECHNICIAN`)
- [x] Full user CRUD (list, get by ID, update role, delete)
- [x] Global exception handling with proper HTTP status codes
- [x] HATEOAS links on all responses

**Frontend**

- [x] Login & Signup pages
- [x] Google OAuth callback handling
- [x] Auth context with session restore on refresh
- [x] Protected routes with role-based redirection
- [x] Axios client with auto JWT header & 401 redirect
- [x] Admin layout (sidebar + topbar) with nested routing
- [x] User layout (sidebar + topbar) with nested routing
- [x] User Management page (filter, search, delete, role update)
- [x] Admin Dashboard with stat cards
- [ ] Notifications module _(in progress)_

---
