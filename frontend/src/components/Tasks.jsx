import React, { useState } from 'react';
import { X, Eye, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      description: "Draft the initial proposal for the client meeting.",
      dateDebut: "2025-03-15",
      dateFin: "2025-03-25"
    },
    {
      id: 2,
      description: "Review the latest UI designs with the design team.",
      dateDebut: "2025-03-20",
      dateFin: "2025-03-22"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({
    description: "",
    dateDebut: "",
    dateFin: ""
  });
  const [showTasks, setShowTasks] = useState(true);

  const handleAddOrEditTask = () => {
    if (newTask.description && newTask.dateDebut && newTask.dateFin) {
      if (isEditing) {
        setTasks(tasks.map((task) => (task.id === currentTask.id ? { ...currentTask, ...newTask } : task)));
      } else {
        const taskToAdd = {
          id: tasks.length + 1,
          ...newTask
        };
        setTasks([...tasks, taskToAdd]);
      }

      setNewTask({ description: "", dateDebut: "", dateFin: "" });
      setShowAddForm(false);
      setIsEditing(false);
      setCurrentTask(null);
    }
  };

  const handleEdit = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setNewTask({
      description: task.description,
      dateDebut: task.dateDebut,
      dateFin: task.dateFin
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

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

      {/* Hero Title */}
      <h1 className="text-4xl font-bold text-center mb-10">Task Management</h1>

      {/* Add Task Button */}
      <div className="mb-6">
        <button
          onClick={() => { setShowAddForm(true); setIsEditing(false); setNewTask({ description: "", dateDebut: "", dateFin: "" }); }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-300"
        >
          + Add Task
        </button>
      </div>

      {/* Task Cards */}
      {showTasks && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-96 h-96 flex flex-col transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-50"
            >
              <div>
                <h3 className="font-bold text-xl mb-3">Task {task.id}</h3>
                <p className="text-gray-700 mb-4 text-sm overflow-hidden line-clamp-3">{task.description}</p>
              </div>
              <div className="mt-auto text-sm">
                <p><span className="font-semibold">Start:</span> {task.dateDebut}</p>
                <p><span className="font-semibold">End:</span> {task.dateFin}</p>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 50 50" fill="currentColor">
                    <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"></path>
                  </svg>
                  Modify
                </button>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 6.0683594 22 L 17.931641 22 L 19.634766 7 L 4.3652344 7 z"></path>
                  </svg>
                  Delete
                </button>
              </div>

              {/* View Resources Button - Added Link to Resources */}
              <Link
                to="/resources"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 justify-center w-full mt-3"
              >
                <Eye size={18} />
                View Resources
              </Link>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-bold text-2xl">{isEditing ? "Edit Task" : "Add New Task"}</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
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
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    name="dateDebut"
                    value={newTask.dateDebut}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    name="dateFin"
                    value={newTask.dateFin}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t">
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrEditTask}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded"
              >
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