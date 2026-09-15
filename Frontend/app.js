// ===== API URL =====
var API = "http://127.0.0.1:8000/api/tasks";
var allTasks = []; // Cache tasks

// ==============================
// Get All Tasks
// ==============================
async function getTasks() {
  try {
    var response = await fetch(API);
    var tasks = await response.json();
    allTasks = tasks;
    showTasks(tasks);
    updateStats(tasks);
  } catch (error) {
    console.log("Error:", error);
  }
}

// ==============================
//  Show Tasks
// ==============================
function showTasks(tasks) {
  var taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  if (!tasks || tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <h3>No tasks yet. Click "Add Task" to get started!</h3>
        <p>Your tasks will appear here</p>
      </div>
    `;
    return;
  }

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var priorityClass = (task.priority || "medium").toLowerCase();
    var statusClass = (task.status || "pending").toLowerCase();

    taskList.innerHTML += `
      <div class="task-card" style="animation-delay: ${i * 0.05}s">
        <div class="task-id">#${i + 1}</div>

        <div class="task-info">
          <div class="task-title">${escapeHtml(task.title)}</div>
          <div class="task-description">${escapeHtml(task.description)}</div>
        </div>

        <div class="task-badges">
          <span class="badge badge-${priorityClass}">${task.priority}</span>
          <span class="badge badge-${statusClass}">${task.status}</span>
        </div>

        <div class="task-actions">
          <button class="btn-icon btn-edit" title="Edit Task" onclick="editTask(${task.id})">✏️</button>
          <button class="btn-icon btn-delete" title="Delete Task" onclick="deleteTask(${task.id})">🗑️</button>
        </div>
      </div>
    `;
  }
}

// Helper to escape HTML characters
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==============================
// //Form Submit Handler (Router)
// // ==============================
function handleFormSubmit(event) {
  if (event) event.preventDefault();

  var editIdInput = document.getElementById("edit-task-id");
  var editId = editIdInput ? editIdInput.value : "";

  if (editId) {
    updateTask(event);
  } else {
    addTask(event);
  }
}

// ==============================
//  Add Task (POST Only)
// ==============================
async function addTask(event) {
  if (event) event.preventDefault();

  var title = document.getElementById("task-title").value;
  var descInput =
    document.getElementById("task-desc") ||
    document.getElementById("task-description");
  var description = descInput ? descInput.value : "";
  var priority = document.getElementById("task-priority").value;
  var status = document.getElementById("task-status").value;

  var task = {
    title: title,
    description: description,
    priority: priority,
    status: status,
  };

  try {
    var response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (response.ok) {
      alert("Task added successfully!");
      if (document.getElementById("task-form")) {
        document.getElementById("task-form").reset();
      }
      closeModal();
      getTasks();
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

// ==============================
//  Delete Task
// ==============================
async function deleteTask(id) {
  var confirmDelete = confirm("Are you sure you want to delete this task?");

  if (!confirmDelete) {
    return;
  }

  try {
    var response = await fetch(API + "/" + id, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Task deleted successfully!");
      getTasks();
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

// Update Task (PUT Request)
async function updateTask(event) {
  if (event) event.preventDefault();

  var editId = document.getElementById("edit-task-id").value;
  var title = document.getElementById("task-title").value;
  var descInput =
    document.getElementById("task-desc") ||
    document.getElementById("task-description");
  var description = descInput ? descInput.value : "";
  var priority = document.getElementById("task-priority").value;
  var status = document.getElementById("task-status").value;

  var task = {
    title: title,
    description: description,
    priority: priority,
    status: status,
  };

  try {
    var response = await fetch(API + "/" + editId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (response.ok) {
      alert("Task updated successfully!");
      document.getElementById("task-form").reset();
      document.getElementById("edit-task-id").value = "";
      closeModal();
      getTasks();
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

// ==============================
// Edit Task (Open Modal with Task Data)
// ==============================
async function editTask(id) {
  var task = allTasks.find(function (t) {
    return t.id == id;
  });

  if (!task) {
    try {
      var res = await fetch(API + "/" + id);
      if (res.ok) {
        task = await res.json();
      }
    } catch (e) {
      console.log("Error:", e);
    }
  }

  if (!task || !task.title) {
    alert("Task not found!");
    return;
  }

  // Populate Modal Form Fields
  if (document.getElementById("edit-task-id")) {
    document.getElementById("edit-task-id").value = task.id;
  }

  if (document.getElementById("task-title")) {
    document.getElementById("task-title").value = task.title;
  }

  var descInput =
    document.getElementById("task-desc") ||
    document.getElementById("task-description");
  if (descInput) {
    descInput.value = task.description;
  }

  if (document.getElementById("task-priority")) {
    document.getElementById("task-priority").value = task.priority;
  }

  if (document.getElementById("task-status")) {
    document.getElementById("task-status").value = task.status;
  }

  // Set Modal Title & Submit Button Text
  if (document.getElementById("modal-title")) {
    document.getElementById("modal-title").innerText = "✏️ Edit Task";
  }

  if (document.getElementById("btn-submit")) {
    document.getElementById("btn-submit").innerText = "Save Changes";
  }

  openModal();
}

// ==============================
// Modal Controls
// ==============================
function openModal() {
  var overlay = document.getElementById("modal-overlay");
  if (overlay) overlay.classList.add("active");
}

function openCreateModal() {
  if (document.getElementById("task-form")) {
    document.getElementById("task-form").reset();
  }
  if (document.getElementById("edit-task-id")) {
    document.getElementById("edit-task-id").value = "";
  }
  if (document.getElementById("modal-title")) {
    document.getElementById("modal-title").innerText = "✨ Create New Task";
  }
  if (document.getElementById("btn-submit")) {
    document.getElementById("btn-submit").innerText = "Create Task";
  }
  openModal();
}

function closeModal() {
  var overlay = document.getElementById("modal-overlay");
  if (overlay) overlay.classList.remove("active");
}

function updateStats(tasks) {
  var total = tasks.length;
  var pending = 0;
  var inProgress = 0;
  var done = 0;

  for (var i = 0; i < tasks.length; i++) {
    var status = tasks[i].status ? tasks[i].status.toLowerCase() : "";

    if (status === "pending") {
      pending++;
    } else if (status === "in_progress" || status === "in progress") {
      inProgress++;
    } else if (status === "done" || status === "completed") {
      done++;
    }
  }

  if (document.getElementById("stat-total")) {
    document.getElementById("stat-total").innerText = total;
  }
  if (document.getElementById("stat-pending")) {
    document.getElementById("stat-pending").innerText = pending;
  }
  if (document.getElementById("stat-progress")) {
    document.getElementById("stat-progress").innerText = inProgress;
  }
  if (document.getElementById("stat-done")) {
    document.getElementById("stat-done").innerText = done;
  }
}

// ==============================
// Filter Tasks by Status (All, Pending, In Progress, Done)
// ==============================
function filterTasks(status, button) {
  var buttons = document.querySelectorAll(".filter-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  if (button) {
    button.classList.add("active");
  }

  if (status === "all") {
    showTasks(allTasks);
    return;
  }

  var filtered = allTasks.filter(function (task) {
    var taskStatus = task.status ? task.status.toLowerCase() : "";
    return taskStatus === status.toLowerCase();
  });

  showTasks(filtered);
}

// ==============================
// Search Tasks
// ==============================
function searchTasks(query) {
  var q = query.toLowerCase();
  var filtered = allTasks.filter(function (task) {
    var title = task.title ? task.title.toLowerCase() : "";
    var desc = task.description ? task.description.toLowerCase() : "";
    return title.indexOf(q) !== -1 || desc.indexOf(q) !== -1;
  });
  showTasks(filtered);
}

// ==============================
// Load Tasks When Page Opens
// ==============================
getTasks();
