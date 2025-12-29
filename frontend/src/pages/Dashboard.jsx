import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchCurrentUser,
  clearAuthTokens,
} from "../api";

const STATUS_LABELS = { TODO: "To Do", DOING: "Doing", DONE: "Done" };
const PRIORITY_LABELS = { LOW: "Low", MEDIUM: "Medium", HIGH: "High" };

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [taskFormError, setTaskFormError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => { bootstrap(); }, []);

  async function bootstrap() {
    try {
      const me = await fetchCurrentUser();
      setUser(me);
      await loadTasks();
    } catch {
      clearAuthTokens();
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    clearAuthTokens();
    window.location.href = "/login";
  }

  async function handleCreateTask(formData) {
    try {
      setCreating(true);
      setTaskFormError("");
      const newTask = await createTask(formData);
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      setTaskFormError(err.message || "Unable to create task.");
    } finally {
      setCreating(false);
    }
  }

  async function handleStatusChange(task, newStatus) {
    if (task.status === newStatus) return;
    const prev = [...tasks];
    setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    try {
      await updateTask(task.id, { status: newStatus });
    } catch {
      setTasks(prev);
    }
  }

  async function handleDelete(taskId) {
    const prev = [...tasks];
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    try {
      await deleteTask(taskId);
    } catch {
      setTasks(prev);
    }
  }

  async function handleSaveEdit(id, payload) {
    const prev = [...tasks];
    setTasks(prevTasks => prevTasks.map(t => t.id === id ? { ...t, ...payload } : t));
    try {
      const updated = await updateTask(id, payload);
      setTasks(prevTasks => prevTasks.map(t => t.id === id ? updated : t));
      setEditingTask(null);
    } catch {
      setTasks(prev);
    }
  }

  function handleDragStart(e, id) {
    setDraggingId(id);
    e.dataTransfer.setData("text/plain", String(id));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnter(status) { setDragOverStatus(status); }
  function handleDragLeave() { setDragOverStatus(null); }

  async function handleDrop(status, e) {
    e.preventDefault();
    const idStr = draggingId ?? e.dataTransfer.getData("text/plain");
    const id = parseInt(idStr, 10);
    const task = tasks.find(t => t.id === id);
    setDragOverStatus(null);
    setDraggingId(null);
    if (!task || task.status === status) return;
    await handleStatusChange(task, status);
  }

  const tasksTodo = tasks.filter(t => t.status === "TODO");
  const tasksDoing = tasks.filter(t => t.status === "DOING");
  const tasksDone = tasks.filter(t => t.status === "DONE");

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">Dashboard</h1>
        {user && (
          <div className="auth-meta">
            <span className="auth-user">{user.email}</span>
            <button className="ghost-button" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      <main className="app-main">
        <section className="panel">
          <div className="panel-head">
            <h2 className="panel-title">Create a new task</h2>
            <p className="panel-subtitle">Set the basics; you can refine later.</p>
          </div>
          <TaskForm onSubmit={handleCreateTask} loading={creating} error={taskFormError} />
        </section>

        <section className="board">
          {loading && <div className="info-box">Loading tasks...</div>}
          {error && <div className="error-box">{error}</div>}

          <div className="board-columns">
            <TaskColumn title="To Do" status="TODO" tasks={tasksTodo} onStatusChange={handleStatusChange} onEdit={setEditingTask} onRequestDelete={setDeleteTarget} onDragStart={handleDragStart} onDropStatus={handleDrop} onDragEnterStatus={handleDragEnter} onDragLeaveStatus={handleDragLeave} dragOverStatus={dragOverStatus} />
            <TaskColumn title="Doing" status="DOING" tasks={tasksDoing} onStatusChange={handleStatusChange} onEdit={setEditingTask} onRequestDelete={setDeleteTarget} onDragStart={handleDragStart} onDropStatus={handleDrop} onDragEnterStatus={handleDragEnter} onDragLeaveStatus={handleDragLeave} dragOverStatus={dragOverStatus} />
            <TaskColumn title="Done" status="DONE" tasks={tasksDone} onStatusChange={handleStatusChange} onEdit={setEditingTask} onRequestDelete={setDeleteTarget} onDragStart={handleDragStart} onDropStatus={handleDrop} onDragEnterStatus={handleDragEnter} onDragLeaveStatus={handleDragLeave} dragOverStatus={dragOverStatus} />
          </div>
        </section>

        {editingTask && <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={handleSaveEdit} />}
        {deleteTarget && <ConfirmDeleteModal task={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={async () => { await handleDelete(deleteTarget.id); setDeleteTarget(null); }} />}
      </main>
    </div>
  );

  // ---------------- Components with original classes ----------------

  function TaskForm({ onSubmit, loading, error }) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("MEDIUM");
    const [dueDate, setDueDate] = useState("");
    const [description, setDescription] = useState("");
    const [localError, setLocalError] = useState("");

    function handleSubmit(e) {
      e.preventDefault();
      if (!title.trim()) {
        setLocalError("Title is required.");
        return;
      }
      onSubmit({ title: title.trim(), description: description.trim(), priority, status: "TODO", due_date: dueDate || null });
      setTitle(""); setDescription(""); setPriority("MEDIUM"); setDueDate(""); setLocalError("");
    }

    return (
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field full-width">
            <label>Task title</label>
            <input type="text" placeholder="What needs to be done?" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Priority</label>
            <select className="select" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="form-field">
            <label>Due date</label>
            <input type="date" className="date-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field full-width">
            <label>Description</label>
            <textarea rows="2" value={description} onChange={e => setDescription(e.target.value)} placeholder="Add a short note..." />
          </div>
        </div>
        {(error || localError) && <div className="error-box inline-error">{error || localError}</div>}
        <div className="form-actions">
          <button type="submit" disabled={loading || !title.trim()}>{loading ? "Saving..." : "Add task"}</button>
        </div>
      </form>
    );
  }

  function TaskColumn({ title, status, tasks, onStatusChange, onEdit, onRequestDelete, onDragStart, onDropStatus, onDragEnterStatus, onDragLeaveStatus, dragOverStatus }) {
    return (
      <div className={`column ${dragOverStatus === status ? "column-dropping" : ""}`} onDragOver={e => e.preventDefault()} onDrop={e => onDropStatus(status, e)} onDragEnter={() => onDragEnterStatus(status)} onDragLeave={onDragLeaveStatus}>
        <div className="column-header">
          <h3>{title}</h3>
          <span className="column-count">{tasks.length}</span>
        </div>
        <div className="column-body">
          {tasks.length === 0 && <p className="column-empty">Nothing here yet.</p>}
          {tasks.map(task => <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onEdit={onEdit} onRequestDelete={onRequestDelete} onDragStart={onDragStart} />)}
        </div>
      </div>
    );
  }

  function TaskCard({ task, onStatusChange, onEdit, onRequestDelete, onDragStart }) {
    return (
      <article className="task-card" draggable onDragStart={e => onDragStart(e, task.id)}>
        <header className="task-card-header">
          <h4>{task.title}</h4>
          <span className={`badge badge-${task.priority.toLowerCase()}`}>{PRIORITY_LABELS[task.priority]}</span>
        </header>
        {task.description && <p className="task-card-description">{task.description}</p>}
        {task.due_date && <div className="task-meta task-meta-date"><span className="task-meta-item">Due: {task.due_date}</span></div>}
        <footer className="task-card-footer">
          <div className="task-actions">
            <div className="status-group">
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <button key={value} type="button" className={`status-button ${value === task.status ? "active" : ""}`} onClick={() => onStatusChange(task, value)}>{label}</button>
              ))}
            </div>
            <div className="action-group">
              <button type="button" className="icon-chip" onClick={() => onEdit(task)}>✎</button>
              <button type="button" className="icon-chip danger" onClick={() => onRequestDelete(task)}>🗑</button>
            </div>
          </div>
        </footer>
      </article>
    );
  }

  function EditTaskModal({ task, onClose, onSave }) {
    const [title, setTitle] = useState(task.title);
    const [priority, setPriority] = useState(task.priority);
    const [status, setStatus] = useState(task.status);
    const [dueDate, setDueDate] = useState(task.due_date || "");
    const [description, setDescription] = useState(task.description || "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSave(e) {
      e.preventDefault();
      if (!title.trim()) { setError("Title is required."); return; }
      setSaving(true); setError("");
      await onSave(task.id, { title, priority, status, due_date: dueDate || null, description });
      setSaving(false);
    }

    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Edit Task</h3>
            <button className="icon-button" onClick={onClose} aria-label="Close">×</button>
          </div>
          <form className="task-form" onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-field">
                <label>Task title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} autoFocus />
              </div>
              <div className="form-field">
                <label>Status</label>
                <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="TODO">To Do</option>
                  <option value="DOING">Doing</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
              <div className="form-field">
                <label>Priority</label>
                <select className="select" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Due date</label>
                <input type="date" className="date-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              <div className="form-field full-width">
                <label>Description</label>
                <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
            </div>
            {error && <div className="error-box inline-error">{error}</div>}
            <div className="form-actions modal-actions">
              <button type="button" className="ghost-button" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function ConfirmDeleteModal({ task, onCancel, onConfirm }) {
    return (
      <div className="modal-backdrop" onClick={onCancel}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Delete Task</h3>
            <button className="icon-button" onClick={onCancel} aria-label="Close">×</button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete <strong>{task.title}</strong>? This cannot be undone.</p>
          </div>
          <div className="form-actions modal-actions">
            <button type="button" className="ghost-button" onClick={onCancel}>Cancel</button>
            <button type="button" className="delete-button" onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    );
  }
}