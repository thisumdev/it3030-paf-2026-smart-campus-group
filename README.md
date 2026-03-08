# 🏛️ Smart Campus Operations Hub

**IT3030 – Programming Applications & Frameworks | 2026 Semester 1**

> A full-stack web platform for managing university facility bookings,
> maintenance tickets, and campus operations.

---

## 👥 Team Members & Modules

| Member   | Module                        | Responsibility                          |
| -------- | ----------------------------- | --------------------------------------- |
| Member 1 | Facilities & Assets Catalogue | Resource management endpoints           |
| Member 2 | Booking & Workflow            | Booking lifecycle & conflict checking   |
| Member 3 | Ticketing & Maintenance       | Incident tickets & attachments          |
| Member 4 | Security & Communications     | OAuth2, Role management & Notifications |

---

## 🛠️ Tech Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| Backend         | Java 22, Spring Boot 4.0.3       |
| Frontend        | React 19, Vite, Tailwind CSS     |
| Database        | SQLite                           |
| Auth            | OAuth 2.0 (Google Sign-in) + JWT |
| Version Control | Git + GitHub Actions             |

---

## 🚀 Getting Started

### Prerequisites

- Java 22+
- Node.js 18+
- Git

### Backend Setup

```bash
cd backend
mvnw.cmd spring-boot:run        # Windows
./mvnw spring-boot:run          # Mac/Linux
```

Backend runs on → http://localhost:8080

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on → http://localhost:5173

---

## 📁 Project Structure

```
smart-campus/
├── backend/          # Spring Boot REST API
└── frontend/         # React Web Application
```

---

## 🌿 Git Branching Strategy

```
main          ← stable, protected (requires PR review)
develop       ← integration branch
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

## 📡 API Endpoints

> Full endpoint documentation coming soon.

| Module        | Base Path            |
| ------------- | -------------------- |
| Auth          | `/api/auth`          |
| Users         | `/api/users`         |
| Resources     | `/api/resources`     |
| Bookings      | `/api/bookings`      |
| Tickets       | `/api/tickets`       |
| Notifications | `/api/notifications` |

---

## 📝 Submission Details

- **Course:** IT3030 – Programming Applications & Frameworks
- **Deadline:** 27th April 2026
- **Viva:** Starting 11th April 2026
