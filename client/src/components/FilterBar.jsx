import styles from './FilterBar.module.css';

const FILTERS = [
  { value: "all",       label: "All"       },
  { value: "active",    label: "Active"    },
  { value: "completed", label: "Completed" },
];

export default function FilterBar({ status, search, onStatusChange, onSearchChange }) {
  return (
    <div className={styles.bar}>

      {/* Filter tabs */}
      <div className={styles.tabs}>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`${styles.tab} ${status === f.value ? styles.active : ""}`}
            onClick={() => onStatusChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="search"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.search}
          aria-label="Search tasks"
        />
      </div>

    </div>
  );
}
