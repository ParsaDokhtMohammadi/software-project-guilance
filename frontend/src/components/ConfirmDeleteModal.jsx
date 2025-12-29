import React from "react";

export default function ConfirmDeleteModal({ task, onCancel, onConfirm }) {
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
