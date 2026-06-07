import { useState, useEffect, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api';

export function useTasks(status, search) {
  const [tasks,   setTasks]   = useState([]);
  const [meta,    setMeta]    = useState({ total: 0, active: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Fetch tasks from backend whenever status or search changes
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks(status, search);
      setTasks(data.tasks);
      setMeta(data.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => { load(); }, [load]);

  // Add a new task then reload the list
  const addTask = async (taskData) => {
    const newTask = await createTask(taskData);
    await load();
    return newTask;
  };

  // Toggle optimistically — update UI instantly, no reload needed
  const toggleTask = async (id, completed) => {
    const updated = await updateTask(id, { completed });
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    setMeta((prev) => ({
      ...prev,
      active:    prev.active    + (completed ? -1 : 1),
      completed: prev.completed + (completed ?  1 : -1),
    }));
    return updated;
  };

  // Edit optimistically — swap the task in-place
  const editTask = async (id, data) => {
    const updated = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  // Delete then reload so ordering stays consistent
  const removeTask = async (id) => {
    await deleteTask(id);
    await load();
  };

  return { tasks, meta, loading, error, addTask, toggleTask, editTask, removeTask, reload: load };
}
