import React, { useState, useEffect } from 'react';
import { X, Eye, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Tasks() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get('projectId');
  
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    description: "",
    startDate: "",
    endDate: "",
    status: "pending"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projectName, setProjectName] = useState("");

  // Fetch project and its tasks on component mount
  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchTasks();
    } else {
      setError("No project ID provided. Please select a project first.");
    }
  }, [projectId]);

  // Fetch project details to get the project name
  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}`);
      setProjectName(response.data.name);
    } catch (err) {
      console.error("Error fetching project details:", err);
    }
  };

  // Fetch tasks for the current project
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tasks/project/${projectId}`);
      
      // Transform backend data to match frontend structure
      const formattedTasks = response.data.map((task, index) => ({
        id: task._id,
        taskNumber: index + 1, // Add sequential task number
        description: task.description,
        dateDebut: new Date(task.startDate).toISOString().split('T')[0],
        dateFin: new Date(task.endDate).toISOString().split('T')[0],
        status: task.status || "pending", // Ensure status is set properly
        resources: task.resources || []
      }));
      
      setTasks(formattedTasks);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add new task or update existing one
  const handleAddOrEditTask = async () => {
    // Basic validation
    if (!newTask.description || !newTask.startDate || !newTask.endDate) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Transform data for backend
      const taskData = {
        description: newTask.description,
        startDate: newTask.startDate,
        endDate: newTask.endDate,
        status: newTask.status, // Status is correctly sent as is
        projectId: projectId
      };
      
      if (isEditing) {
        // Update existing task
        await axios.put(`${API_URL}/tasks/${currentTask.id}`, taskData);
      } else {
        // Create new task
        await axios.post(`${API_URL}/tasks`, taskData);
      }

      // Refresh the tasks list
      fetchTasks();

      // Reset form state
      setNewTask({ description: "", startDate: "", endDate: "", status: "pending" });
      setShowAddForm(false);
      setIsEditing(false);
      setCurrentTask(null);
      setError(null);

    } catch (err) {
      console.error("Error saving task:", err);
      setError(isEditing ? "Failed to update task" : "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  // Set up edit form with task data
  const handleEdit = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setNewTask({
      description: task.description,
      startDate: task.dateDebut,
      endDate: task.dateFin,
      status: task.status
    });
    setShowAddForm(true);
  };

  // Delete a task
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setLoading(true);
      try {
        await axios.delete(`${API_URL}/tasks/${id}`);
        setTasks(tasks.filter((task) => task.id !== id));
        setError(null);
      } catch (err) {
        console.error("Error deleting task:", err);
        setError("Failed to delete task");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value
    });
  };

  return (
    <div className="p-5">
      {/* Back to Projects Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/projects')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Projects
        </button>
      </div>

      {/* Hero Title with Project Name */}
      <h1 className="text-4xl font-bold text-center mb-2">Task Management</h1>
      {projectName && (
        <h2 className="text-2xl text-gray-600 text-center mb-10">
          Project: {projectName}
        </h2>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add Task Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowAddForm(true);
            setIsEditing(false);
            setNewTask({ description: "", startDate: "", endDate: "", status: "pending" });
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-300"
          disabled={loading || !projectId}
        >
          {loading ? "Processing..." : "+ Add Task"}
        </button>
      </div>

      {/* Loading indicator */}
      {loading && !showAddForm && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-2">Loading tasks...</p>
        </div>
      )}

      {/* Empty state message */}
      {!loading && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gray-100 rounded-full p-6 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">No Tasks Found</h2>
          <p className="text-gray-600 max-w-md mb-6">Get started by creating your first task for this project. Click the "Add Task" button above to begin.</p>
          <button
            onClick={() => {
              setShowAddForm(true);
              setIsEditing(false);
              setNewTask({ description: "", startDate: "", endDate: "", status: "pending" });
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors duration-300"
            disabled={!projectId}
          >
            Create Your First Task
          </button>
        </div>
      )}

      {/* Task Cards */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tasks.map(task => {
            // Determine status badge color
            let statusColor = "bg-yellow-100 text-yellow-800"; // Default for pending
            if (task.status === "in-progress") {
              statusColor = "bg-blue-100 text-blue-800";
            } else if (task.status === "completed") {
              statusColor = "bg-green-100 text-green-800";
            }
            
            return (
              <div
                key={task.id}
                className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-96 h-96 flex flex-col transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-50"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl">Task {task.taskNumber}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 text-sm overflow-hidden line-clamp-3">{task.description}</p>
                </div>
                <div className="mt-auto text-sm">
                  <p><span className="font-semibold">Start:</span> {task.dateDebut}</p>
                  <p><span className="font-semibold">End:</span> {task.dateFin}</p>
                  <p><span className="font-semibold">Resources:</span> {task.resources.length} assigned</p>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded flex items-center gap-2"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 50 50" fill="currentColor">
                      <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
                    </svg>
                    Modify
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 6.0683594 22 L 17.931641 22 L 19.634766 7 L 4.3652344 7 z"></path>
                    </svg>
                    Delete
                  </button>
                </div>

                {/* View Resources Button */}
                <Link
                  to={`/resources?taskId=${task.id}`}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 justify-center w-full mt-3"
                >
                  <Eye size={18} />
                  View Resources
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Add/Edit Task */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-bold text-2xl">{isEditing ? "Edit Task" : "Add New Task"}</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded"
                  placeholder="Enter task description"
                  rows="4"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newTask.startDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newTask.endDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={newTask.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded"
                    disabled={loading}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditTask}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded flex items-center gap-2"
                disabled={loading}
              >
                {loading && (
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                )}
                {isEditing ? "Update Task" : "Save Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;