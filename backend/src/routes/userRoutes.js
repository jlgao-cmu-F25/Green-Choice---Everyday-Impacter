const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dataStore = require('../config/dataStore');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const trimmedUsername = username.trim();
    
    // Check if user already exists
    const existingUser = dataStore.users.find(u => u.username.toLowerCase() === trimmedUsername.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      userId,
      username: trimmedUsername,
      password: hashedPassword,
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
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
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
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login with username and password
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const trimmedUsername = username.trim();
    
    // Find user by username
    const user = dataStore.users.find(u => u.username.toLowerCase() === trimmedUsername.toLowerCase());
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
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