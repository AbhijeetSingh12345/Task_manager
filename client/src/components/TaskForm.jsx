import { useState, useEffect, useRef } from 'react';
import styles from './TaskForm.module.css';

export default function TaskForm({ onSubmit, onCancel, initialData = null }) {
  const isEdit = Boolean(initialData);

  // Pre-fill when editing, empty when adding
  const [title,       setTitle]       = useState(initialData?.title       || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [dueDate,     setDueDate]     = useState(
    initialData?.dueDate ? initialData.dueDate.slice(0, 10) : ""
  );
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef(null);

  // Auto-focus the title input when form mounts
  useEffect(() => { titleRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required."); return; }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        title:       title.trim(),
        description: description.trim(),
        dueDate:     dueDate || null,
      });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{isEdit ? "Edit Task" : "New Task"}</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>

        {/* Title field */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="task-title">
            Title <span className={styles.required}>*</span>
          </label>
          <input
            id="task-title"
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            maxLength={200}
          />
          {error && <span className={styles.fieldError}>{error}</span>}
        </div>

        {/* Description + Due Date row */}
        <div className={styles.row}>
          <div className={`${styles.field} ${styles.grow}`}>
            <label className={styles.label} htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details…"
              className={styles.textarea}
              rows={2}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="task-due">Due Date</label>
            <input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.cancelBtn} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Task"}
          </button>
        </div>

      </form>
    </div>
  );
}
