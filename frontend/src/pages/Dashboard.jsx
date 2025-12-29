import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchCurrentUser,
  clearAuthTokens,
} from "../api";
import TaskForm from "../components/TaskForm";
import TaskColumn from "../components/TaskColumn";
import EditTaskModal from "../components/EditTaskModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

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
      window.location.href = "/";
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
    window.location.href = "/";
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
}