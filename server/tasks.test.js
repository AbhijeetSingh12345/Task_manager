const request = require('supertest');
const app     = require('./index');
const store   = require('./store/taskStore');

// Reset data before each test so tests are isolated
beforeEach(() => { store._reset([]); });

// ── POST /api/tasks ────────────────────────────────────────────────────
describe('POST /api/tasks', () => {
  it('creates a task with a title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Buy groceries' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Buy groceries');
    expect(res.body.completed).toBe(false);
    expect(res.body.id).toBeDefined();
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'No title' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

// ── GET /api/tasks ─────────────────────────────────────────────────────
describe('GET /api/tasks', () => {
  it('returns tasks sorted newest first', async () => {
    await request(app).post('/api/tasks').send({ title: 'First' });
    await request(app).post('/api/tasks').send({ title: 'Second' });
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.tasks[0].title).toBe('Second');
    expect(res.body.tasks[1].title).toBe('First');
  });

  it('filters by status=active', async () => {
    await request(app).post('/api/tasks').send({ title: 'Active Task' });
    const r = await request(app).post('/api/tasks').send({ title: 'Done Task' });
    await request(app).patch(`/api/tasks/${r.body.id}`).send({ completed: true });
    const res = await request(app).get('/api/tasks?status=active');
    expect(res.body.tasks.length).toBe(1);
    expect(res.body.tasks[0].title).toBe('Active Task');
  });

  it('returns meta counts', async () => {
    await request(app).post('/api/tasks').send({ title: 'Task 1' });
    const r  = await request(app).post('/api/tasks').send({ title: 'Task 2' });
    await request(app).patch(`/api/tasks/${r.body.id}`).send({ completed: true });
    const res = await request(app).get('/api/tasks');
    expect(res.body.meta.total).toBe(2);
    expect(res.body.meta.active).toBe(1);
    expect(res.body.meta.completed).toBe(1);
  });
});

// ── PATCH /api/tasks/:id ───────────────────────────────────────────────
describe('PATCH /api/tasks/:id', () => {
  it('toggles completed', async () => {
    const post = await request(app).post('/api/tasks').send({ title: 'Toggle me' });
    const res  = await request(app)
      .patch(`/api/tasks/${post.body.id}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).patch('/api/tasks/nonexistent').send({ completed: true });
    expect(res.status).toBe(404);
  });
});

// ── DELETE /api/tasks/:id ──────────────────────────────────────────────
describe('DELETE /api/tasks/:id', () => {
  it('deletes a task and returns 404 on re-fetch', async () => {
    const post = await request(app).post('/api/tasks').send({ title: 'Delete me' });
    const del  = await request(app).delete(`/api/tasks/${post.body.id}`);
    expect(del.status).toBe(204);
    const get = await request(app).get(`/api/tasks/${post.body.id}`);
    expect(get.status).toBe(404);
  });
});
