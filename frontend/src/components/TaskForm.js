import React, { useState, useEffect } from 'react';

// A reusable form for creating or editing a task.
function TaskForm({ onSubmit, initialData }) {
    // A single state object is often cleaner for forms.
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
    });
    
    // When initialData changes (i.e., when editing a task), populate the form.
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                // The date input expects a 'YYYY-MM-DD' format.
                dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().substring(0, 10) : '',
                priority: initialData.priority || 'Medium',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prevent submission if the title is empty.
        if (!formData.title.trim()) return;

        onSubmit(formData);

        // Only reset the form if we're creating a new task (no initialData).
        if (!initialData) {
            setFormData({ title: '', description: '', dueDate: '', priority: 'Medium' });
        }
    };

    const isEditing = !!initialData;

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2>{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
            
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title" // Name attribute is crucial for the generic handleChange
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                ></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
            </div>

            <button type="submit" className="btn-primary">
                {isEditing ? 'Update Task' : 'Add Task'}
            </button>
        </form>
    );
}

export default TaskForm;