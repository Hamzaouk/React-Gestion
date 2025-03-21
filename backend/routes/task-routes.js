const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Routes pour les tâches
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.get('/project/:projectId', taskController.getTasksByProject);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;