const BASE = '/api/tasks';

// ── Response helper ────────────────────────────────────────────────────
async function handleResponse(res) {
  if (res.status === 204) return null;  // DELETE returns no body
  const data = await res.json();
  if (!res.ok) {
    const message = data.errors ? data.errors.join(", ") : data.error || "Request failed";
    throw new Error(message);
  }
  return data;
}

// ── API functions ──────────────────────────────────────────────────────
export async function fetchTasks(status = "all", search = "") {
  const params = new URLSearchParams({ status });
  if (search) params.set("search", search);
  const res = await fetch(`${BASE}?${params}`);
  return handleResponse(res);
}

export async function createTask(data) {
  const res = await fetch(BASE, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateTask(id, data) {
  const res = await fetch(`${BASE}/${id}`, {
    method:  "PATCH",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return handleResponse(res);
}
