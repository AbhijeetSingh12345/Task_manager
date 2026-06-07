
import { useState } from 'react';
import TaskForm     from './TaskForm';
import styles       from './TaskCard.module.css';

// Returns true if task is past its due date and not completed
function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

// Format date for display
function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [editing,  setEditing]  = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const overdue = isOverdue(task.dueDate, task.completed);

  const handleToggle = async () => {
    setToggling(true);
    try   { await onToggle(task.id, !task.completed); }
    finally { setToggling(false); }
  };

  const handleEdit = async (data) => {
    await onEdit(task.id, data);
    setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      setDeleting(true);
      onDelete(task.id).catch(() => setDeleting(false));
    }
  };

  // Show edit form inline instead of the card
  if (editing) {
    return (
      <TaskForm
        initialData={task}
        onSubmit={handleEdit}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className={[
      styles.card,
      task.completed ? styles.completed : "",
      overdue        ? styles.overdue   : "",
      deleting       ? styles.deleting  : "",
    ].join(" ")}>

      {/* Overdue badge */}
      {overdue && <span className={styles.overdueTag}>Overdue</span>}

      <div className={styles.main}>

        {/* Checkbox */}
        <button
          className={`${styles.checkbox} ${task.completed ? styles.checked : ""}`}
          onClick={handleToggle}
          disabled={toggling}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <path d="M1 5l3.5 3.5L11 1" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Task content */}
        <div className={styles.content}>
          <p className={styles.title}>{task.title}</p>
          {task.description && (
            <p className={styles.description}>{task.description}</p>
          )}
          {task.dueDate && (
            <span className={`${styles.due} ${overdue ? styles.dueOverdue : ""}`}>
              {overdue ? "⚠ " : ""}Due {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {/* Edit + Delete buttons (visible on hover) */}
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={() => setEditing(true)}
            aria-label="Edit task" title="Edit">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M11.5 1.5l2 2-9 9H2.5v-2l9-9z" stroke="currentColor"
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={handleDelete} aria-label="Delete task" title="Delete">
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none">
              <path d="M1 4h12M5 4V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V4M5.5 7v5M8.5 7v5M2 4l.9 9a1 1 0 001 .9h6.2a1 1 0 001-.9L12 4"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
