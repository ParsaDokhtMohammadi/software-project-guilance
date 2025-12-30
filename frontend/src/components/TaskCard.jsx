export const STATUS_LABELS = { TODO: "To Do", DOING: "Doing", DONE: "Done" };
export const PRIORITY_LABELS = { LOW: "Low", MEDIUM: "Medium", HIGH: "High" };

export default function TaskCard({ task, onStatusChange, onEdit, onRequestDelete, onDragStart }) {
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
