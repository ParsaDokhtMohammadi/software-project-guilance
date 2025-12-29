import React from "react";
import TaskCard from "./TaskCard";

export default function TaskColumn({ title, status, tasks, onStatusChange, onEdit, onRequestDelete, onDragStart, onDropStatus, onDragEnterStatus, onDragLeaveStatus, dragOverStatus }) {
  return (
    <div className={`column ${dragOverStatus === status ? "column-dropping" : ""}`} 
         onDragOver={e => e.preventDefault()} 
         onDrop={e => onDropStatus(status, e)} 
         onDragEnter={() => onDragEnterStatus(status)} 
         onDragLeave={onDragLeaveStatus}>
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
