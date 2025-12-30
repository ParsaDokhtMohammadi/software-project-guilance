import React, { useState } from "react";

export default function TaskForm({ onSubmit, loading, error }) {
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
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: "TODO",
      due_date: dueDate || null
    });
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
          <label htmlFor="dueDate">Due date</label>
          <input id="dueDate" type="date" className="date-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
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
