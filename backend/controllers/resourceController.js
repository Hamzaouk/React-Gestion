const Resource = require('../models/resource');
const Task = require('../models/task');

// Récupérer toutes les ressources
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des ressources", error: error.message });
  }
};

// Récupérer une ressource par son ID
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Ressource non trouvée" });
    }
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la ressource", error: error.message });
  }
};

// Créer une nouvelle ressource
exports.createResource = async (req, res) => {
  try {
    const { name, type, quantity, supplier } = req.body;
    
    // Validation de base
    if (!name || !type || !quantity) {
      return res.status(400).json({ message: "Veuillez fournir toutes les informations nécessaires (nom, type et quantité)" });
    }
    
    const newResource = new Resource({
      name,
      type,
      quantity,
      supplier: supplier || {}
    });
    
    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la ressource", error: error.message });
  }
};

// Mettre à jour une ressource
exports.updateResource = async (req, res) => {
  try {
    const { name, type, quantity, supplier } = req.body;
    
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      { name, type, quantity, supplier },
      { new: true, runValidators: true }
    );
    
    if (!updatedResource) {
      return res.status(404).json({ message: "Ressource non trouvée" });
    }
    
    res.status(200).json(updatedResource);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la ressource", error: error.message });
  }
};

// Supprimer une ressource
exports.deleteResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    
    // Vérifier si la ressource est utilisée dans des tâches
    const taskWithResource = await Task.findOne({ resources: resourceId });
    if (taskWithResource) {
      return res.status(400).json({ 
        message: "Impossible de supprimer cette ressource car elle est utilisée dans des tâches",
        taskId: taskWithResource._id
      });
    }
    
    const deletedResource = await Resource.findByIdAndDelete(resourceId);
    
    if (!deletedResource) {
      return res.status(404).json({ message: "Ressource non trouvée" });
    }
    
    res.status(200).json({ message: "Ressource supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la ressource", error: error.message });
  }
};