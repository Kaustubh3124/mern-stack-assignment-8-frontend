import React from 'react';

// Displays a single task item.
function TaskItem({ task, onEdit, onDelete, onUpdate }) {
    // A small helper to format dates consistently.
    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleToggleComplete = () => {
        onUpdate(task._id, { isCompleted: !task.isCompleted });
    };

    // Use a map for cleaner class lookups instead of a switch statement.
    const priorityClassMap = {
        High: 'priority-high',
        Medium: 'priority-medium',
        Low: 'priority-low',
    };
    const priorityClass = priorityClassMap[task.priority] || '';

    return (
        <div className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
            <div className="task-header">
                <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={handleToggleComplete}
                    aria-label={`Mark ${task.title} as ${task.isCompleted ? 'incomplete' : 'complete'}`}
                />
                <h3 className={task.isCompleted ? 'completed-text' : ''}>{task.title}</h3>
                <span className={`task-priority ${priorityClass}`}>{task.priority}</span>
            </div>

            {task.description && <p className="task-description">{task.description}</p>}
            
            <div className="task-meta">
                <span>Due: {formatDate(task.dueDate)}</span>
                <span>Created: {formatDate(task.createdAt)}</span>
            </div>
            
            <div className="task-actions">
                <button className="btn-edit" onClick={onEdit}>Edit</button>
                <button className="btn-delete" onClick={() => onDelete(task._id)}>Delete</button>
            </div>
        </div>
    );
}

export default TaskItem;