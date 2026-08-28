# 📝 ToDo Manager

A simple and user-friendly **ToDo Manager Web Application** built while learning **FastAPI** and REST API development.

## 🚀 About the Project

I built this project to get practical experience with **FastAPI, REST APIs, CRUD operations, and backend-database communication**.

The application allows users to manage their tasks easily from a web interface.

## ✨ Features

* ➕ Add new tasks
* 👀 View task details
* ✏️ Update existing tasks
* 🗑️ Delete tasks
* ✅ Update task status
* 🔍 Search tasks

## 🛠️ Technologies Used

### Backend

* Python
* FastAPI
* Uvicorn

### Frontend

* HTML
* CSS
* JavaScript

### Database

* SQL Server

## 🔄 CRUD Operations

| Method | Operation      | Endpoint          |
| ------ | -------------- | ----------------- |
| GET    | View all tasks | `/api/tasks`      |
| GET    | View a task    | `/api/tasks/{id}` |
| POST   | Add a task     | `/api/tasks`      |
| PUT    | Update a task  | `/api/tasks/{id}` |
| DELETE | Delete a task  | `/api/tasks/{id}` |

## 📂 Project Structure

```text
ToDo-Manager/
│
├── backend/
├── frontend/
├── .gitignore
├── requirements.txt
└── README.md
```

## ▶️ How to Run

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Create and activate virtual environment

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run FastAPI

```bash
uvicorn backend.main:app --reload
```

### 5. Open API Documentation

```text
http://127.0.0.1:8000/docs
```

## 🎯 Learning Outcome

This project helped me understand:

* FastAPI fundamentals
* REST API development
* CRUD operations
* API request and response handling
* Database integration
* Connecting frontend with backend

## 👨‍💻 Author

**Sujit Kar**

---

⭐ This project was built as a learning project while exploring **FastAPI and backend development**.
