const Task = require('../models/task');
const Project = require('../models/Projects');

// Récupérer toutes les tâches
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('projectId').populate('resources');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des tâches", error: error.message });
  }
};

// Récupérer toutes les tâches d'un projet
exports.getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Vérifier si le projet existe
    const projectExists = await Project.exists({ _id: projectId });
    if (!projectExists) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    
    const tasks = await Task.find({ projectId }).populate('resources');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des tâches du projet", error: error.message });
  }
};

// Récupérer une tâche par son ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId').populate('resources');
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la tâche", error: error.message });
  }
};

// Créer une nouvelle tâche
exports.createTask = async (req, res) => {
  try {
    const { description, startDate, endDate, projectId, resources } = req.body;
    
    // Validation de base
    if (!description || !startDate || !endDate || !projectId) {
      return res.status(400).json({ message: "Veuillez fournir toutes les informations nécessaires (description, dates et projet)" });
    }
    
    // Vérifier si le projet existe
    const projectExists = await Project.exists({ _id: projectId });
    if (!projectExists) {
      return res.status(404).json({ message: "Le projet spécifié n'existe pas" });
    }
    
    const newTask = new Task({
      description,
      startDate,
      endDate,
      projectId,
      resources: resources || []
    });
    
    const savedTask = await newTask.save();
    
    // Obtenir la tâche complète avec les relations
    const populatedTask = await Task.findById(savedTask._id)
      .populate('projectId')
      .populate('resources');
      
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la tâche", error: error.message });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  try {
    const { description, startDate, endDate, projectId, resources } = req.body;
    
    // Si projectId est fourni, vérifier s'il existe
    if (projectId) {
      const projectExists = await Project.exists({ _id: projectId });
      if (!projectExists) {
        return res.status(404).json({ message: "Le projet spécifié n'existe pas" });
      }
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { description, startDate, endDate, projectId, resources },
      { new: true, runValidators: true }
    ).populate('projectId').populate('resources');
    
    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche", error: error.message });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    
    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la tâche", error: error.message });
  }
};