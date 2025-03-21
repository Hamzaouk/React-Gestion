const Project = require('../models/projects');

// Récupérer tous les projets
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des projets", error: error.message });
  }
};

// Récupérer un projet par son ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du projet", error: error.message });
  }
};

// Créer un nouveau projet
exports.createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, budget } = req.body;
    
    // Validation de base
    if (!name || !startDate || !endDate || !budget) {
      return res.status(400).json({ message: "Veuillez fournir toutes les informations nécessaires (nom, dates et budget)" });
    }
    
    const newProject = new Project({
      name,
      description,
      startDate,
      endDate,
      budget
    });
    
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du projet", error: error.message });
  }
};

// Mettre à jour un projet
exports.updateProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate, budget } = req.body;
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, startDate, endDate, budget },
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du projet", error: error.message });
  }
};

// Supprimer un projet
exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    
    if (!deletedProject) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }
    
    res.status(200).json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du projet", error: error.message });
  }
};