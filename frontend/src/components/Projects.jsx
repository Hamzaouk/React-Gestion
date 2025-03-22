import React, { useState, useEffect } from 'react';
import { X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import projectSchema from '../validation/projectvalidation';

const API_URL = 'http://localhost:5000/api';

function Projects() {
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: ""
  });
  const [showTasks, setShowTasks] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch all projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch projects from API
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/projects`);
      // Transform backend data to match frontend structure
      const formattedProjects = response.data.map(project => ({
        id: project._id,
        name: project.name,
        description: project.description,
        dateDebut: new Date(project.startDate).toISOString().split('T')[0],
        dateFin: new Date(project.endDate).toISOString().split('T')[0],
        budget: project.budget.toString()
      }));
      setTasks(formattedProjects);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add new project or update existing one with Yup validation
  const handleAddOrEditTask = async () => {
    try {
      // Reset validation errors
      setValidationErrors({});
      
      // Validate newTask using Yup schema
      await projectSchema.validate(newTask, { abortEarly: false });

      setLoading(true);

      // Transform data for backend
      const projectData = {
        name: newTask.name,
        description: newTask.description,
        startDate: newTask.startDate,
        endDate: newTask.endDate,
        budget: Number(newTask.budget)
      };

      if (isEditing) {
        // Update existing project
        await axios.put(`${API_URL}/projects/${currentTask.id}`, projectData);
      } else {
        // Create new project
        await axios.post(`${API_URL}/projects`, projectData);
      }

      // Refresh the projects list
      fetchProjects();

      // Reset form state
      setNewTask({ name: "", description: "", startDate: "", endDate: "", budget: "" });
      setShowAddForm(false);
      setIsEditing(false);
      setCurrentTask(null);
      setError(null);

    } catch (err) {
      console.error("Error saving project:", err);

      // Handle validation errors
      if (err.name === "ValidationError") {
        // Create object with field-specific errors
        const fieldErrors = {};
        err.inner.forEach(e => {
          fieldErrors[e.path] = e.message;
        });
        setValidationErrors(fieldErrors);
        
        // Set general error message
        setError("Please correct the validation errors below.");
      } else {
        setError(isEditing ? "Failed to update project" : "Failed to create project");
      }

    } finally {
      setLoading(false);
    }
  };

  // Set up edit form with project data
  const handleEdit = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setNewTask({
      name: task.name,
      description: task.description,
      startDate: task.dateDebut,
      endDate: task.dateFin,
      budget: task.budget
    });
    setValidationErrors({});
    setShowAddForm(true);
  };

  // Delete a project
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setLoading(true);
      try {
        await axios.delete(`${API_URL}/projects/${id}`);
        setTasks(tasks.filter((task) => task.id !== id));
        setError(null);
      } catch (err) {
        console.error("Error deleting project:", err);
        setError("Failed to delete project");
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
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined
      });
    }
  };

  return (
    <div className="p-5">
      {/* Hero Title */}
      <h1 className="text-4xl font-bold text-center mb-10">Project Management</h1>

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
            setNewTask({ name: "", description: "", startDate: "", endDate: "", budget: "" });
            setValidationErrors({});
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-300"
          disabled={loading}
        >
          {loading ? "Processing..." : "+ Add Project"}
        </button>
      </div>

      {/* Loading indicator */}
      {loading && !showAddForm && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-2">Loading projects...</p>
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
          <h2 className="text-2xl font-semibold mb-2">No Projects Found</h2>
          <p className="text-gray-600 max-w-md mb-6">Get started by creating your first project. Click the "Add Project" button above to begin.</p>
          <button
            onClick={() => {
              setShowAddForm(true);
              setIsEditing(false);
              setNewTask({ name: "", description: "", startDate: "", endDate: "", budget: "" });
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors duration-300"
          >
            Create Your First Project
          </button>
        </div>
      )}

      {/* Task Cards */}
      {showTasks && tasks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-96 h-96 flex flex-col transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-50"
            >
              <div>
                <h3 className="font-bold text-xl mb-3">{task.name}</h3>
                <p className="text-gray-700 mb-4 text-sm overflow-hidden line-clamp-3">{task.description}</p>
              </div>
              <div className="mt-auto text-sm">
                <p><span className="font-semibold">Start:</span> {task.dateDebut}</p>
                <p><span className="font-semibold">End:</span> {task.dateFin}</p>
                <p><span className="font-semibold">Budget:</span> {task.budget} DH</p>
              </div>

              {/* Action Buttons with SVGs */}
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
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 6.0683594 22 L 17.931641 22 L 19.634766 7 L 4.3652344 7 z"></path>
                  </svg>
                  Delete
                </button>
              </div>

              {/* View Button - Updated with Link to Tasks */}
              <Link
                to={`/tasks?projectId=${task.id}`}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 justify-center w-full mt-3"
              >
                <Eye size={18} />
                View Tasks
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-bold text-2xl">{isEditing ? "Edit Project" : "Add New Project"}</h3>
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
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={newTask.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded ${validationErrors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter project name"
                  disabled={loading}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded ${validationErrors.description ? 'border-red-500' : ''}`}
                  placeholder="Enter project description"
                  rows="4"
                  disabled={loading}
                />
                {validationErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newTask.startDate}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded ${validationErrors.startDate ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {validationErrors.startDate && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.startDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newTask.endDate}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded ${validationErrors.endDate ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {validationErrors.endDate && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.endDate}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Budget (in DH)</label>
                  <input
                    type="number"
                    name="budget"
                    value={newTask.budget}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded ${validationErrors.budget ? 'border-red-500' : ''}`}
                    placeholder="Enter project budget"
                    disabled={loading}
                  />
                  {validationErrors.budget && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.budget}</p>
                  )}
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
                {isEditing ? "Update Project" : "Save Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;