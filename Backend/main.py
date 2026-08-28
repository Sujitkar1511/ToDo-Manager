from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import Database Functions

from database import (
    fetch_all_tasks,
    create_task_db,
    delete_task_db,
    update_task_db,
    get_task_by_id_db
)

app = FastAPI()

# Allow Frontend to Connect to Backend (CORS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#validation Model for Task

class Task(BaseModel):
    title: str
    description: str
    priority: str
    status: str


# ২. GET - All Tasks 
@app.get("/api/tasks")
def get_tasks():
    tasks = fetch_all_tasks()
    return [task_to_dict(task) for task in tasks]


# ৩. POST - Add Task 
@app.post("/api/tasks")
def create_task(task: Task):
    task_id = create_task_db(
        task.title,
        task.description,
        task.priority,
        task.status
    )
    return {
        "message": "Task created successfully",
        "task_id": task_id
    }


# ৪. DELETE - Delete Task 
@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int):
    deleted_task = delete_task_db(task_id)

    if deleted_task is None:
        return {"message": "Task not found"}

    return {
        "message": "Task deleted successfully",
        "task_id": deleted_task[0]
    }


# ৫. PUT - Update Task 
@app.put("/api/tasks/{task_id}")
def update_task(task_id: int, task: Task):
    updated_task = update_task_db(
        task_id,
        task.title,
        task.description,
        task.priority,
        task.status
    )

    if updated_task is None:
        return {"message": "Task not found"}

    return {
        "message": "Task updated successfully",
        "task_id": updated_task[0]
    }


# Helper function to convert task tuple to dictionary

def task_to_dict(task):
    return {
        "id": task[0],
        "title": task[1],
        "description": task[2],
        "priority": task[3],
        "status": task[4]
    }

# GET - Single Task
@app.get("/api/tasks/{task_id}")
def get_task(task_id: int):
    task = get_task_by_id_db(task_id)

    if task is None:
        return {"message": "Task not found"}

    return task_to_dict(task)
