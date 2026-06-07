# ✦ Taskly — Personal Task Manager

> Exercise : Personal Task Manager**
> A full-stack task manager built with Node.js + Express (backend) and React + Vite (frontend). Users can create, view, edit, delete and filter personal tasks. Tasks persist across server restarts via a JSON file.

---
## ✨ Features

- ✅ Add a task with title (required), description (optional), and due date (optional)
- ✅ View all tasks sorted by creation date (newest first)
- ✅ Mark tasks as complete or incomplete (toggle)
- ✅ Edit a task's title, description, or due date inline
- ✅ Delete a task with a confirmation prompt
- ✅ Filter tasks by status — All, Active, Completed
- ✅ Search tasks by title in real time
- ✅ Active and completed task count shown in the header
- ✅ Overdue tasks highlighted with a red border and "Overdue" badge
- ✅ Empty state UI when no tasks exist
- ✅ Loading skeleton animation while fetching
- ✅ Tasks persist across server restarts (saved to tasks.json)
- ✅ Fully responsive on mobile

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Backend** | Node.js + Express | Minimal setup, clean REST conventions, widely understood |
| **Frontend** | React 18 + Vite | Fast dev server, hooks-first, no boilerplate overhead |
| **Styling** | CSS Modules | Scoped styles per component, zero runtime cost |
| **Storage** | JSON file (fs module) | Persists across restarts with zero database setup |
| **Testing** | Jest + Supertest | Industry standard for Node; Supertest makes HTTP testing clean |
| **Fonts** | Google Fonts (Syne + Instrument Sans) | Clean, distinctive typography |

---

## 📁 Project Structure

```
task-manager/
│
├── server/                          ← Backend (Node.js + Express)
│   ├── routes/
│   │   └── tasks.js                 ← All 5 REST API endpoints
│   ├── store/
│   │   ├── taskStore.js             ← In-memory store + JSON persistence
│   │   └── tasks.json               ← Auto-created on first task add
│   ├── index.js                     ← Express app entry point
│   ├── tasks.test.js                ← 8 Jest + Supertest integration tests
│   └── package.json
│
├── client/                          ← Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           ← App bar: logo, task counts, New Task button
│   │   │   ├── Header.module.css
│   │   │   ├── FilterBar.jsx        ← Status tabs + search input
│   │   │   ├── FilterBar.module.css
│   │   │   ├── TaskForm.jsx         ← Add / Edit form (shared component)
│   │   │   ├── TaskForm.module.css
│   │   │   ├── TaskList.jsx         ← Skeleton / empty state / task list
│   │   │   ├── TaskList.module.css
│   │   │   ├── TaskCard.jsx         ← Individual task row with actions
│   │   │   └── TaskCard.module.css
│   │   ├── hooks/
│   │   │   └── useTasks.js          ← Custom hook: all task state + API calls
│   │   ├── App.jsx                  ← Root component, global state
│   │   ├── App.module.css
│   │   ├── api.js                   ← All fetch() calls to backend in one place
│   │   ├── index.css                ← Global CSS variables + reset
│   │   └── main.jsx                 ← React entry point
│   ├── index.html
│   ├── vite.config.js               ← Vite config + /api proxy to backend
│   └── package.json
│
└── README.md
```

---

## 🚀 How to Run Locally

> **Prerequisite:** Node.js v18 or higher installed. That is all you need.
> Download from https://nodejs.org if you don't have it.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager
```

### 2. Install and start the backend

Open a terminal and run:

```bash
cd server
npm install
npm run dev
```

You should see:
```
Server running on http://localhost:4000
```

### 3. Install and start the frontend

Open a **second terminal** and run:

```bash
cd client
npm install
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### 4. Open the app

Go to **http://localhost:3000** in your browser.

> Both terminals must stay open while using the app.
> The Vite dev server automatically proxies `/api` requests to the backend on port 4000.

---

## 🧪 Running Tests

```bash
cd server
npm test
```

Expected output:
```
PASS ./tasks.test.js

  POST /api/tasks
    ✓ creates a task with a title
    ✓ returns 400 when title is missing

  GET /api/tasks
    ✓ returns tasks sorted newest first
    ✓ filters by status=active
    ✓ returns meta counts

  PATCH /api/tasks/:id
    ✓ toggles completed
    ✓ returns 404 for unknown id

  DELETE /api/tasks/:id
    ✓ deletes a task and returns 404 on re-fetch

Tests: 8 passed, 8 total
```

---

## 📡 API Documentation

Base URL: `http://localhost:4000/api`

---

### `GET /api/tasks`

Returns a filtered list of tasks and aggregate counts.

**Query Parameters:**

| Param | Values | Default | Description |
|---|---|---|---|
| `status` | `all` `active` `completed` | `all` | Filter by completion status |
| `search` | any string | `""` | Filter by title (case-insensitive) |

**Example Request:**
```
GET /api/tasks?status=active&search=groceries
```

**Response `200 OK`:**
```json
{
  "tasks": [
    {
      "id": "a1b2c3d4-...",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "dueDate": "2025-06-10",
      "completed": false,
      "createdAt": "2025-06-05T10:00:00.000Z",
      "updatedAt": "2025-06-05T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 5,
    "active": 3,
    "completed": 2
  }
}
```

---

### `GET /api/tasks/:id`

Returns a single task by ID.

**Response `200 OK`:** Task object

**Response `404`:**
```json
{ "error": "Task not found." }
```

---

### `POST /api/tasks`

Creates a new task.

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2025-06-10"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ✅ Yes | Max 200 characters |
| `description` | string | No | Optional details |
| `dueDate` | string (ISO date) | No | e.g. `"2025-06-10"` |

**Response `201 Created`:** Created task object

**Response `400 Bad Request`:**
```json
{ "errors": ["Title is required and must be a non-empty string."] }
```

---

### `PATCH /api/tasks/:id`

Updates one or more fields of a task. All fields are optional.

**Request Body (any subset):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2025-07-01",
  "completed": true
}
```

**Response `200 OK`:** Updated task object

**Response `404`:**
```json
{ "error": "Task not found." }
```

---

### `DELETE /api/tasks/:id`

Deletes a task permanently.

**Response `204 No Content`:** Success (no body)

**Response `404`:**
```json
{ "error": "Task not found." }
```

---

### `GET /api/health`

Health check endpoint.

**Response `200 OK`:**
```json
{ "status": "ok" }
```

---

## 🔮 Next Steps

Given more time, I would add:

- **Drag-and-drop reordering** using `@dnd-kit/core`
- **SQLite database** via `better-sqlite3` for more reliable persistence and querying
- **Frontend tests** using React Testing Library + Vitest
- **Toast notifications** instead of inline error divs
- **Keyboard shortcuts** — `n` to open new task form, `Escape` to close
- **Dark mode** — CSS variables are already structured to support it with a simple toggle
- **Due date reminders** — browser notifications when a task is about to be overdue
- **Smooth exit animations** on task removal before the DOM node is removed

---

## 📝 Notes

- **AI tools used:** Claude was used for code structure suggestions and CSS design. All code is fully understood and can be walked through line by line in a technical discussion.
- **Task persistence:** Tasks are saved to `server/store/tasks.json` and survive server restarts.
- **No authentication:** The brief specified one user — no login system is implemented.

---

## 👤 Author

**Abhijeet Singh**
- Email: abhijeetsinghrajput05@gmail.com

