const STORAGE_KEY = "focuslist-tasks";

let tasks = loadTasks();
let currentFilter = "all";
let editingTaskId = null;

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const addButton = document.querySelector(".add-button");
const cancelButton = document.querySelector("#cancel-edit");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const message = document.querySelector("#message");
const filterButtons = document.querySelectorAll(".filter-button");

const totalCount = document.querySelector("#total-count");
const activeCount = document.querySelector("#active-count");
const completedCount = document.querySelector("#completed-count");

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (savedTasks === null) {
    return [];
  }

  return JSON.parse(savedTasks);
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(text) {
  return {
    id: Date.now(),
    text: text,
    completed: false,
  };
}

function getVisibleTasks() {
  return tasks.filter(function (task) {
    if (currentFilter === "active") {
      return task.completed === false;
    }

    if (currentFilter === "completed") {
      return task.completed === true;
    }

    return true;
  });
}

function createButton(text, className, action, id) {
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = text;
  button.className = className;
  button.dataset.action = action;
  button.dataset.id = id;

  return button;
}

function createTaskElement(task) {
  const li = document.createElement("li");

  const check = document.createElement("button");
  check.textContent = task.completed ? "✓" : "";
  check.dataset.action = "toggle";
  check.dataset.id = task.id;

  const text = document.createElement("p");
  text.textContent = task.text;

  const edit = document.createElement("button");
  edit.textContent = "Edit";
  edit.dataset.action = "edit";
  edit.dataset.id = task.id;

  const del = document.createElement("button");
  del.textContent = "Delete";
  del.dataset.action = "delete";
  del.dataset.id = task.id;

  li.append(check, text, edit, del);

  return li;
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();

  taskList.innerHTML = "";

  visibleTasks.forEach(function (task) {
    taskList.appendChild(createTaskElement(task));
  });

  emptyState.hidden = visibleTasks.length > 0;
  updateStats();
}

function updateStats() {
  let completedTasks = 0;

  tasks.forEach(function (task) {
    if (task.completed) {
      completedTasks++;
    }
  });

  totalCount.textContent = tasks.length;
  activeCount.textContent = tasks.length - completedTasks;
  completedCount.textContent = completedTasks;
}

function showMessage(text) {
  message.textContent = text;
  message.classList.add("visible");

  setTimeout(function () {
    message.classList.remove("visible");
  }, 2200);
}

function resetForm() {
  editingTaskId = null;
  taskForm.reset();
  addButton.textContent = "Add task";
  cancelButton.hidden = true;
}

function addOrEditTask(event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (text === "") {
    taskInput.focus();
    return;
  }

  if (editingTaskId !== null) {
    tasks = tasks.map(function (task) {
      if (task.id === editingTaskId) {
        return { ...task, text: text };
      }

      return task;
    });

    showMessage("Task updated.");
  } else {
    tasks.push(createTask(text));
    showMessage("Task added.");
  }

  saveTasks();
  renderTasks();
  resetForm();
}

function editTask(id) {
  const task = tasks.find(function (task) {
    return task.id === id;
  });

  if (task === undefined) {
    return;
  }

  editingTaskId = id;
  taskInput.value = task.text;
  addButton.textContent = "Save changes";
  cancelButton.hidden = false;
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  saveTasks();
  renderTasks();
  showMessage("Task deleted.");
}

taskForm.addEventListener("submit", addOrEditTask);
cancelButton.addEventListener("click", resetForm);

taskList.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (button === null) {
    return;
    function deleteTask(id) {
      tasks = tasks.filter(function (task) {
        return task.id !== id;
      });

      saveTasks();
      renderTasks();
      showMessage("Task deleted.");
    }

    taskForm.addEventListener("submit", addOrEditTask);
    cancelButton.addEventListener("click", resetForm);

    taskList.addEventListener("click", function (event) {
      const button = event.target.closest("button");

      if (button === null) {
        return;
      }

      const id = Number(button.dataset.id);
      const action = button.dataset.action;

      if (action === "toggle") {
        toggleTask(id);
      } else if (action === "edit") {
        editTask(id);
      } else if (action === "delete") {
        deleteTask(id);
      }
    });

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (filterButton) {
          filterButton.classList.remove("active");
        });

        button.classList.add("active");
        renderTasks();
      });
    });

    renderTasks();
  }

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "toggle") {
    toggleTask(id);
  } else if (action === "edit") {
    editTask(id);
  } else if (action === "delete") {
    deleteTask(id);
  }
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (filterButton) {
      filterButton.classList.remove("active");
    });

    button.classList.add("active");
    renderTasks();
  });
});

renderTasks();
  