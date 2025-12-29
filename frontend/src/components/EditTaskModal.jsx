import React, { useState } from "react";

export default function EditTaskModal({ task, onClose, onSave }) {
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
