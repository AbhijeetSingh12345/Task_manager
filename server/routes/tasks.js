const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store/taskStore');

const router = express.Router();

// ── Validation helper ──────────────────────────────────────────────────
function validateTask(body, requireTitle = true) {
  const errors = [];

  if (requireTitle && (!body.title || typeof body.title !== "string" || body.title.trim() === "")) {
    errors.push("Title is required and must be a non-empty string.");
  }
  if (body.title && body.title.trim().length > 200) {
    errors.push("Title must be 200 characters or fewer.");
  }
  if (body.dueDate && isNaN(Date.parse(body.dueDate))) {
    errors.push("dueDate must be a valid ISO date string.");
  }

  return errors;
}

// ── GET /api/tasks ─────────────────────────────────────────────────────
// Query params: status=all|active|completed   search=<string>
router.get("/", (req, res) => {
  const { status = "all", search = "" } = req.query;
  let tasks = store.getAll();

  if (status === "active")    tasks = tasks.filter((t) => !t.completed);
  if (status === "completed") tasks = tasks.filter((t) =>  t.completed);

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    tasks = tasks.filter((t) => t.title.toLowerCase().includes(term));
  }

  const all       = store.getAll();
  const total     = all.length;
  const active    = all.filter((t) => !t.completed).length;
  const completed = total - active;

  res.json({ tasks, meta: { total, active, completed } });
});

// ── GET /api/tasks/:id ─────────────────────────────────────────────────
router.get("/:id", (req, res) => {
  const task = store.getById(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found." });
  res.json(task);
});

// ── POST /api/tasks ────────────────────────────────────────────────────
router.post("/", (req, res) => {
  const errors = validateTask(req.body, true);
  if (errors.length) return res.status(400).json({ errors });

  const task = store.create({
    id:          uuidv4(),
    title:       req.body.title.trim(),
    description: req.body.description ? req.body.description.trim() : "",
    dueDate:     req.body.dueDate || null,
    createdAt:   new Date().toISOString(),
  });

  res.status(201).json(task);
});

// ── PATCH /api/tasks/:id ───────────────────────────────────────────────
router.patch("/:id", (req, res) => {
  const existing = store.getById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Task not found." });

  const errors = validateTask(req.body, false);
  if (errors.length) return res.status(400).json({ errors });

  const updates = {};
  if (req.body.title       !== undefined) updates.title       = req.body.title.trim();
  if (req.body.description !== undefined) updates.description = req.body.description.trim();
  if (req.body.dueDate     !== undefined) updates.dueDate     = req.body.dueDate || null;
  if (typeof req.body.completed === "boolean") updates.completed = req.body.completed;

  const updated = store.update(req.params.id, updates);
  res.json(updated);
});

// ── DELETE /api/tasks/:id ──────────────────────────────────────────────
router.delete("/:id", (req, res) => {
  const deleted = store.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Task not found." });
  res.status(204).send();
});

module.exports = router;
