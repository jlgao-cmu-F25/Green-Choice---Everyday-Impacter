const express = require('express');
const router = express.Router();
const dataStore = require('../config/dataStore');

// Get leaderboard
router.get('/', (req, res) => {
  try {
    const { period = 'week', limit = 10 } = req.query;
    
    // Get all users with their stats
    const users = dataStore.users.filter(user => 
      user.totalCO2Saved > 0 || user.totalWaterSaved > 0 || user.totalWasteSaved > 0
    );
    
    // Calculate combined score for sorting (CO2 is weighted most heavily)
    const usersWithScores = users.map(user => ({
      userId: user.userId,
      username: user.username,
      totalCO2: user.totalCO2Saved || 0,
      totalWater: user.totalWaterSaved || 0,
      totalWaste: user.totalWasteSaved || 0,
      // Combined score: CO2 * 10 + Water * 0.1 + Waste * 2
      score: (user.totalCO2Saved || 0) * 10 + (user.totalWaterSaved || 0) * 0.1 + (user.totalWasteSaved || 0) * 2
    }));
    
    // Sort by score descending
    const sortedUsers = usersWithScores.sort((a, b) => b.score - a.score);
    
    // Apply limit
    const limitedResults = sortedUsers.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      period,
      limit: parseInt(limit),
      leaderboard: limitedResults
    });
    
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;