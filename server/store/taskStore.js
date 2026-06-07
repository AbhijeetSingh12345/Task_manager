const fs   = require('fs');
const path = require('path');

// tasks.json lives in the same folder (server/store/tasks.json)
const DATA_FILE = path.join(__dirname, 'tasks.json');

// ── Load from disk on startup ──────────────────────────────────────────
function loadTasks() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    console.warn("Could not read tasks.json — starting with empty list.");
  }
  return [];
}

// ── Write to disk after every change ──────────────────────────────────
function saveTasks(tasks) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf-8");
  } catch {
    console.warn("Could not save tasks.json — changes will not persist.");
  }
}

let tasks = loadTasks();

// ── Store API ──────────────────────────────────────────────────────────
const store = {
  // Return a sorted copy (newest first) — never mutate the array directly
  getAll() {
    return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id) {
    return tasks.find((t) => t.id === id) || null;
  },

  create(taskData) {
    const task = {
      id:          taskData.id,
      title:       taskData.title,
      description: taskData.description || "",
      dueDate:     taskData.dueDate || null,
      completed:   false,
      createdAt:   taskData.createdAt || new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    };
    tasks.unshift(task);  // Add to front (newest first)
    saveTasks(tasks);
    return task;
  },

  update(id, updates) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tasks[index] = {
      ...tasks[index],
      ...updates,
      id,                             // id is never overwritten
      updatedAt: new Date().toISOString(),
    };
    saveTasks(tasks);
    return tasks[index];
  },

  delete(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    saveTasks(tasks);
    return true;
  },

  // Used only in tests to reset state between test runs
  _reset(newTasks = []) {
    tasks = newTasks;
  },
};

module.exports = store;
