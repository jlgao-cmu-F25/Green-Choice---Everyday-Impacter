const express = require('express');
const router = express.Router();
const dataStore = require('../config/dataStore');

// Login with username
router.post('/login', (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const trimmedUsername = username.trim();
    
    // Check if user exists
    let user = dataStore.users.find(u => u.username === trimmedUsername);
    
    if (!user) {
      // Create new user if doesn't exist
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      user = {
        userId,
        username: trimmedUsername,
        currentStreak: 0,
        longestStreak: 0,
        lastActionDate: null,
        totalCO2Saved: 0,
        totalWaterSaved: 0,
        totalWasteSaved: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      dataStore.users.push(user);
    }
    
    res.json({
      success: true,
      user: {
        userId: user.userId,
        username: user.username,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalCO2Saved: user.totalCO2Saved,
        totalWaterSaved: user.totalWaterSaved,
        totalWasteSaved: user.totalWasteSaved
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = dataStore.users.find(u => u.userId === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      userId: user.userId,
      username: user.username,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalCO2Saved: user.totalCO2Saved,
      totalWaterSaved: user.totalWaterSaved,
      totalWasteSaved: user.totalWasteSaved
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;