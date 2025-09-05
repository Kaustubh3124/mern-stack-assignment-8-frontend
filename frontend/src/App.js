import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm.js';
import TaskList from './components/TaskList.js';
import './App.css';

// The root component that holds the main application state and logic.
function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true); // Start with loading true for initial fetch
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Central API instance. Using an env variable is best practice.
    const apiClient = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    });

    // Fetches tasks from the backend based on current filters and search query.
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filterStatus !== 'all') {
                params.append('status', filterStatus);
            }

            let url = '/api/tasks';
            if (searchQuery) {
                url = '/api/tasks/search';
                params.append('query', searchQuery);
            }

            const response = await apiClient.get(url, { params });
            setTasks(response.data.data);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
            setError(err.response?.data?.error || 'Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filterStatus, apiClient]); // apiClient is stable

    // Effect to re-fetch tasks whenever filters or search query change.
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Generic handler for all API operations to reduce boilerplate.
    const handleApiCall = async (apiCall, successCallback) => {
        setError(null);
        try {
            const response = await apiCall();
            successCallback(response.data.data);
        } catch (err) {
            console.error('API call failed:', err);
            setError(err.response?.data?.error || 'An unexpected error occurred.');
        }
    };

    const addTask = (taskData) => {
        handleApiCall(
            () => apiClient.post('/api/tasks', taskData),
            (newTask) => setTasks(prevTasks => [...prevTasks, newTask])
        );
    };

    const updateTask = (id, updatedData) => {
        handleApiCall(
            () => apiClient.patch(`/api/tasks/${id}`, updatedData),
            (updatedTask) => setTasks(prevTasks =>
                prevTasks.map(task => (task._id === id ? updatedTask : task))
            )
        );
    };

    const deleteTask = (id) => {
        handleApiCall(
            () => apiClient.delete(`/api/tasks/${id}`),
            () => setTasks(prevTasks => prevTasks.filter(task => task._id !== id))
        );
    };
    
    // Display logic for loading, error, or no tasks states.
    const renderContent = () => {
        if (loading) {
            return <div className="message loading">Loading tasks...</div>;
        }
        if (error) {
            return <div className="message error">Error: {error}</div>;
        }
        if (tasks.length === 0) {
            return <div className="message no-tasks">No tasks found. Create one above!</div>;
        }
        return (
            <TaskList
                tasks={tasks}
                onUpdate={updateTask}
                onDelete={deleteTask}
            />
        );
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>MERN Stack To-Do List</h1>
            </header>
            <main className="App-main">
                <TaskForm onSubmit={addTask} />

                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                {renderContent()}
            </main>
            <footer className="App-footer">
                <p>&copy; {new Date().getFullYear()} MERN To-Do App</p>
            </footer>
        </div>
    );
}

export default App;