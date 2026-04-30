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

feature/module1-#respectivefeature
```

### Branch Rules

- No direct push to `main`
- All merges to `main` require **at least 1 reviewer approval**
- All merges go through `develop` first then to `main`

---

## API Endpoints

### Member 1 — Facilities & Assets Catalogue

> _To be updated by Member 1_

### Member 2 — Booking & Workflow

> _To be updated by Member 2_

### Member 3 — Ticketing & Maintenance

#### Tickets

| Method   | Endpoint                   | Auth               | Status | Description                                                                              |
| -------- | -------------------------- | ------------------ | ------ | ---------------------------------------------------------------------------------------- |
| `POST`   | `/api/tickets`             | Any JWT            | 201    | Create a new incident ticket (title, description, priority, category, resourceId)        |
| `GET`    | `/api/tickets`             | ADMIN              | 200    | Get all tickets                                                                          |
| `GET`    | `/api/tickets/my`          | Any JWT            | 200    | Get tickets created by the logged-in user                                                |
| `GET`    | `/api/tickets/{id}`        | Any JWT            | 200    | Get a single ticket by ID                                                                |
| `GET`    | `/api/tickets/assigned`    | TECHNICIAN         | 200    | Get tickets assigned to the current technician                                           |
| `PATCH`  | `/api/tickets/{id}/status` | ADMIN / TECHNICIAN | 200    | Update ticket status; optionally assign technician, add resolution notes or rejection reason |
| `DELETE` | `/api/tickets/{id}`        | ADMIN              | 204    | Delete a ticket (cascades to images and comments)                                        |
| `GET`    | `/api/tickets/resources`   | Any JWT            | 200    | List all campus resources (used to populate the submit form dropdown)                    |
| `POST`   | `/api/tickets/{id}/images` | Any JWT            | 200    | Upload up to 3 evidence images (`multipart/form-data`, field: `files`)                  |

#### Ticket Comments

| Method   | Endpoint                                       | Auth    | Status | Description                                            |
| -------- | ---------------------------------------------- | ------- | ------ | ------------------------------------------------------ |
| `POST`   | `/api/tickets/{ticketId}/comments`             | Any JWT | 201    | Add a comment to a ticket                              |
| `GET`    | `/api/tickets/{ticketId}/comments`             | Any JWT | 200    | Get all comments on a ticket (ordered oldest → newest) |
| `DELETE` | `/api/tickets/{ticketId}/comments/{commentId}` | Any JWT | 204    | Delete own comment (returns 403 if not the author)     |

### Member 4 — Security & Communications

#### User & Auth

| Method   | Endpoint               | Auth    | Status | Description                      |
| -------- | ---------------------- | ------- | ------ | -------------------------------- |
| `POST`   | `/api/users/register`  | Public  | 201    | Register new user                |
| `POST`   | `/api/users/login`     | Public  | 200    | Login, returns JWT               |
| `GET`    | `/api/users/me`        | Any JWT | 200    | Get own profile                  |
| `GET`    | `/api/users`           | ADMIN   | 200    | List all users (`?role=` filter) |
| `GET`    | `/api/users/{id}`      | ADMIN   | 200    | Get user by ID                   |
| `PUT`    | `/api/users/{id}/role` | ADMIN   | 200    | Update user role                 |
| `DELETE` | `/api/users/{id}`      | ADMIN   | 204    | Delete user                      |
| `PUT`    | `/api/users/me`        | Any JWT | 200    | Update own profile               |
| `DELETE` | `/api/users/me`        | Any JWT | 204    | Delete own account               |

#### Notifications — User-Facing

| Method   | Endpoint                          | Auth    | Status | Description                           |
| -------- | --------------------------------- | ------- | ------ | ------------------------------------- |
| `GET`    | `/api/notifications`              | Any JWT | 200    | Get own notifications (newest first)  |
| `GET`    | `/api/notifications/unread-count` | Any JWT | 200    | Get unread notification count         |
| `GET`    | `/api/notifications/recent`       | Any JWT | 200    | Get latest 5 notifications (for bell) |
| `PATCH`  | `/api/notifications/{id}/read`    | Any JWT | 200    | Mark a single notification as read    |
| `PATCH`  | `/api/notifications/read-all`     | Any JWT | 200    | Mark all notifications as read        |
| `DELETE` | `/api/notifications/{id}`         | Any JWT | 204    | Delete own notification               |

#### Notifications — Admin

| Method   | Endpoint                        | Auth  | Status | Description                                                       |
| -------- | ------------------------------- | ----- | ------ | ----------------------------------------------------------------- |
| `POST`   | `/api/admin/notifications/send` | ADMIN | 201    | Send notification — targets: `USER` / `SELECTED` / `ROLE` / `ALL` |
| `GET`    | `/api/admin/notifications`      | ADMIN | 200    | List all notifications (`?userId=` `?type=` `?isRead=`)           |
| `PUT`    | `/api/admin/notifications/{id}` | ADMIN | 200    | Edit a notification's title or message                            |
| `DELETE` | `/api/admin/notifications/{id}` | ADMIN | 204    | Delete any notification                                           |

---

## ✅ Implementation Progress

### Member 1 — Facilities & Assets Catalogue

> _To be updated by Member 1_

### Member 2 — Booking & Workflow

> _To be updated by Member 2_

### Member 3 — Ticketing & Maintenance

**Backend**

- [x] `Ticket` entity with status, priority, category enums; `@PrePersist` auto-sets `createdAt`
- [x] `TicketImage` entity linked to `Ticket` (up to 3 images, UUID-named, stored on disk)
- [x] `TicketComment` entity with author ownership; ordered by `createdAt ASC`
- [x] `TicketService` interface + `TicketServiceImpl` (full layered architecture)
- [x] Create ticket — validates title, description, priority, category, resourceId via `@Valid`
- [x] Get all tickets (admin), get my tickets (user), get by ID, get assigned tickets (technician)
- [x] Update ticket status — `OPEN → IN_PROGRESS → RESOLVED → CLOSED`; `REJECTED` requires reason
- [x] Technician assignment via `PATCH /status` (sets `assignee`, fires `TICKET_ASSIGNED` notification)
- [x] Resolution notes stored on `RESOLVED`; `resolvedAt` timestamp auto-set
- [x] Image upload endpoint — enforces max 3 images per ticket, UUID filenames, `IOException` handled
- [x] Comment CRUD — add, list, delete own (ownership check throws 403 if not author)
- [x] NotificationService integration — fires notifications on every status transition
- [x] `GlobalExceptionHandler` covers 400 / 403 / 404 / 409 / 500 with structured `ApiResponse`
- [x] `TicketRepository` uses `@EntityGraph` to prevent N+1 on reporter, resource, assignee, images
- [x] Postman collection provided (`Ticket_Management.postman_collection.json`)

**Frontend**

- [x] Submit Ticket page (`SubmitTicketPage.jsx`) — form with resource dropdown, priority, category, preferred contact
- [x] My Tickets page (`MyTicketsPage.jsx`) — list of own tickets with status badges and priority indicators
- [x] Ticket Detail page (`TicketDetailPage.jsx`) — full ticket view with image gallery and comment thread
- [x] Assigned Tickets page (`AssignedTicketsPage.jsx`) — technician view of assigned tickets
- [x] Admin Tickets page (`AdminTicketsPage.jsx`) — full ticket table with status update and technician assignment controls
- [x] Technician Dashboard (`TechnicianDashboard.jsx`) with assigned ticket summary
- [x] Technician Assignments page (`TechnicianAssignments.jsx`) — manage and update ticket status inline
- [x] Technician layout (`TechnicianLayout.jsx` + `TechnicianSideBar.jsx`) with role-protected routing

### Member 4 — Security & Communications

**Backend**

- [x] User registration with BCrypt password encoding
- [x] JWT login with role-based claims
- [x] Google OAuth 2.0 sign-in
- [x] Role-based access control (`USER`, `ADMIN`, `TECHNICIAN`)
- [x] Full user CRUD (list, get by ID, update role, delete)
- [x] Global exception handling with proper HTTP status codes
- [x] HATEOAS links on all responses
- [x] Notification entity with type, title, message, referenceId, referenceType, read flag
- [x] User-facing notification endpoints (fetch, unread count, bell preview, mark read, delete)
- [x] Admin notification send — targets: `USER`, `SELECTED`, `ROLE`, `ALL`
- [x] Admin notification management (list with filters, update, delete)
- [x] Internal `notify()` integration method for Bookings & Tickets modules to call
- [x] Auto-derived titles from `NotificationType` (covers all booking & ticket states + GENERAL)

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
- [x] User profile panel (view, edit, delete own account)
- [x] Email validation on Login & Signup pages
- [x] Password strength meter on Signup page
- [x] Notifications module
  - [x] Notification bell with unread badge (top 5 preview)
  - [x] Mark as read (single & all)
  - [x] Full notifications page (user-facing)
  - [x] Admin send notification panel (USER / SELECTED / ROLE / ALL targets)
  - [x] Admin notification management (filter by user, type, read status; edit; delete)

---
