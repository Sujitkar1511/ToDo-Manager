import psycopg

# Database connection function
def get_connection():
    return psycopg.connect(
        host="localhost", port=5432, dbname="taskManager", user="postgres", password="1009"
    )


#all Tasks
def fetch_all_tasks():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, description, priority, status FROM tasks ORDER BY id")
    tasks = cursor.fetchall()
    cursor.close()
    conn.close()
    return tasks

#Inser Task
def create_task_db(title, description, priority, status):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO tasks
        (title, description, priority, status)
        VALUES (%s, %s, %s, %s)
        RETURNING id;
    """, (title, description, priority, status))

    task_id = cursor.fetchone()[0]

    conn.commit()
    cursor.close()
    conn.close()

    return task_id


#Delete Task

def delete_task_db(task_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM tasks
        WHERE id = %s
        RETURNING id;
    """, (task_id,))

    deleted_task = cursor.fetchone()

    conn.commit()
    cursor.close()
    conn.close()

    return deleted_task


#Update Task

def update_task_db(task_id, title, description, priority, status):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE tasks SET title=%s, description=%s, priority=%s, status=%s WHERE id=%s RETURNING id;
    """, (title, description, priority, status, task_id))
    updated = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    return updated


# Get Single Task by ID
def get_task_by_id_db(task_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, description, priority, status FROM tasks WHERE id = %s", (task_id,))
    task = cursor.fetchone()
    cursor.close()
    conn.close()
    return task
