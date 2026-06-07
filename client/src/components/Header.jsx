import styles from './Header.module.css';

export default function Header({ meta, onNewTask }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.logo}>✦</span>
          <span className={styles.name}>Taskly</span>
        </div>

        {/* Active / Completed counts */}
        <div className={styles.stats}>
          <span className={styles.stat}>
            <span className={styles.statNum}>{meta.active}</span>
            <span className={styles.statLabel}> active</span>
          </span>
          <span className={styles.divider}>·</span>
          <span className={styles.stat}>
            <span className={styles.statNum}>{meta.completed}</span>
            <span className={styles.statLabel}> done</span>
          </span>
        </div>

        {/* New task button */}
        <button className={styles.newBtn} onClick={onNewTask} aria-label="Add new task">
          + New Task
        </button>

      </div>
    </header>
  );
}
