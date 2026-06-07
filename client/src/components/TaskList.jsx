import TaskCard from './TaskCard';
import styles   from './TaskList.module.css';

export default function TaskList({ tasks, loading, onToggle, onEdit, onDelete }) {

  // Loading state — animated skeleton cards
  if (loading) {
    return (
      <div className={styles.skeletons}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>◎</span>
        <p className={styles.emptyTitle}>Nothing here</p>
        <p className={styles.emptyText}>Add a task to get started.</p>
      </div>
    );
  }

  // Task list
  return (
    <ul className={styles.list} role="list">
      {tasks.map((task) => (
        <li key={task.id} className={styles.item}>
          <TaskCard
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
