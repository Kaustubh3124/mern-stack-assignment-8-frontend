import React, { useState } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

// Displays the list of tasks and handles the editing modal.
function TaskList({ tasks, onUpdate, onDelete }) {
    const [editingTask, setEditingTask] = useState(null);

    // When an update is submitted from the modal form, call the main update function.
    const handleUpdate = (updatedData) => {
        onUpdate(editingTask._id, updatedData);
        setEditingTask(null); // Close the modal
    };

    return (
        <div className="task-list-container">
            {editingTask && (
                <div className="modal-overlay" onClick={() => setEditingTask(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <TaskForm onSubmit={handleUpdate} initialData={editingTask} />
                        <button className="btn-secondary" onClick={() => setEditingTask(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <h2>Your Tasks</h2>
            <div className="task-list">
                {tasks.map(task => (
                    <TaskItem
                        key={task._id}
                        task={task}
                        onEdit={() => setEditingTask(task)}
                        onDelete={onDelete}
                        // Pass the onUpdate function down to handle toggling completion
                        onUpdate={onUpdate}
                    />
                ))}
            </div>
        </div>
    );
}

export default TaskList;