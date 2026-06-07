import { useState, useCallback } from 'react';
import { useTasks }  from './hooks/useTasks';
import Header        from './components/Header';
import FilterBar     from './components/FilterBar';
import TaskForm      from './components/TaskForm';
import TaskList      from './components/TaskList';
import styles        from './App.module.css';

export default function App() {
  const [status,   setStatus]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [showForm, setShowForm] = useState(false);

  const { tasks, meta, loading, error, addTask, toggleTask, editTask, removeTask }
    = useTasks(status, search);

  const handleAddTask = useCallback(async (data) => {
    await addTask(data);
    setShowForm(false);  // Close form after successful add
  }, [addTask]);

  return (
    <div className={styles.layout}>
      <Header meta={meta} onNewTask={() => setShowForm(true)} />

      <main className={styles.main}>
        <FilterBar
          status={status}   search={search}
          onStatusChange={setStatus}
          onSearchChange={setSearch}
        />

        {showForm && (
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
          />
        )}

        {error && <div className={styles.error}>{error}</div>}

        <TaskList
          tasks={tasks}   loading={loading}
          onToggle={toggleTask}
          onEdit={editTask}
          onDelete={removeTask}
        />
      </main>
    </div>
  );
}
