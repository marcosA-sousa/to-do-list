# 📝 To-Do List Application

A simple and efficient task management application built with vanilla JavaScript, Express.js, and SQLite.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

---

## 🎯 Features

- ✅ Create, edit, and delete tasks
- 📊 Filter tasks by status (pending or completed)
- 🔄 Sort by date, title, or status
- 📱 Fully responsive (mobile, tablet, desktop)
- 💾 Local SQLite database (no external dependencies)
- ⚡ Fast and lightweight
- 🔒 Input validation on both frontend and backend

---

## 🛠️ Technology Stack

### Frontend
- 🎨 **HTML5** - Semantic markup
- 🌈 **CSS3** - Modern styling with flexbox
- ⚙️ **JavaScript** - Vanilla JS (no frameworks)

### Backend
- 🚀 **Node.js** - JavaScript runtime
- 📦 **Express.js** - Web framework
- 🗄️ **SQLite3** - Local database

---

## 📂 Project Structure

```
to-do-list/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── server.js          # Express server setup
│   │   ├── routes.js          # API routes (CRUD operations)
│   │   └── database.js        # SQLite connection & initialization
│   ├── 📁 data/
│   │   └── tasks.db           # SQLite database file
│   ├── package.json           # Dependencies & scripts
│   └── .env                   # Environment variables
│
├── 📁 frontend/
│   ├── index.html             # Main HTML
│   ├── style.css              # Styling
│   └── script.js              # Client-side logic
│
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)

### Installation & Setup

#### 1️⃣ Clone or navigate to the project
```bash
cd to-do-list
```

#### 2️⃣ Install backend dependencies
```bash
cd backend
npm install
```

#### 3️⃣ Start the backend server
```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:3000
📝 Health check: http://localhost:3000/health
🔗 API base: http://localhost:3000/api
```

#### 4️⃣ Open frontend in another terminal
```bash
# From project root
cd frontend

# Start a simple HTTP server
npx http-server . -p 8000
```

#### 5️⃣ Open in browser
```
http://localhost:8000
```

✅ **Done!** Your To-Do List is ready to use.

---

## 📺 Demo Video

[Add your project demo video here]

```html
<!-- Example: 
<a href="https://your-video-link">
  <img src="video-thumbnail.jpg" alt="To-Do List Demo" width="400">
</a>
-->
```

---

## 🔌 API Endpoints

### Get all tasks
```bash
GET /api/tasks
```

### Get task by ID
```bash
GET /api/tasks/:id
```

### Create task
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "pending"
}
```

### Update task
```bash
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Buy groceries",
  "status": "completed"
}
```

### Delete task
```bash
DELETE /api/tasks/:id
```

### Query Parameters
- `status` - Filter by status: `pending` or `completed`
- `sortBy` - Sort field: `created_at`, `title`, or `status` (default: `created_at`)
- `order` - Sort order: `asc` or `desc` (default: `desc`)

**Example:**
```bash
GET /api/tasks?status=pending&sortBy=title&order=asc
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Port 3000 already in use** | Change `PORT` in `backend/.env` or kill process using that port |
| **"npm: command not found"** | Install Node.js from https://nodejs.org/ |
| **Frontend can't connect to backend** | Make sure backend is running on `localhost:3000` |
| **Database errors** | Delete `backend/data/tasks.db` and restart (it will recreate) |
| **CORS errors** | Verify backend is running and endpoints match in frontend/script.js |

---

## 📝 Project Details

### Database Schema
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL CHECK(status IN ('pending', 'completed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Validation Rules
- **Title:** Required, max 255 characters
- **Description:** Optional, max 1000 characters
- **Status:** Either `pending` or `completed`

---

## 📄 License

MIT License - Feel free to use this project for any purpose.

---

## 👨‍💻 Author

**Marcos Aurélio Ribeiro de Sousa**

Developed as an internship project at IN100tiva.

---

## 🤝 Contributing

Feel free to fork, modify, and submit pull requests!

---

**Last Updated:** May 2026

