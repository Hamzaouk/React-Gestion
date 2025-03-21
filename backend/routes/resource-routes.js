const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

// Routes pour les ressources
router.get('/', resourceController.getAllResources);
router.get('/:id', resourceController.getResourceById);
router.post('/', resourceController.createResource);
router.put('/:id', resourceController.updateResource);
router.delete('/:id', resourceController.deleteResource);

module.exports = router;