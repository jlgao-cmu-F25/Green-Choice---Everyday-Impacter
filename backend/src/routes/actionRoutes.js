const express = require('express');
const router = express.Router();
const actionController = require('../controllers/ActionController');

// Get all available eco actions
router.get('/actions', actionController.getAllActions);

// Log a new action
router.post('/actions/log', actionController.logAction);

// Log a custom bike ride
router.post('/actions/log-bike-ride', actionController.logBikeRide);

// Get user's actions with optional period filter
router.get('/users/:userId/actions', actionController.getUserActions);

// Get user statistics
router.get('/users/:userId/stats', actionController.getUserStats);

module.exports = router;
