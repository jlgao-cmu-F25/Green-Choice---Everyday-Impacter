const { EcoAction, UserAction, User } = require('../models/InMemoryModels');
const impactCalculator = require('../services/ImpactCalculator');
const streakService = require('../services/StreakService');

class ActionController {
  async getAllActions(req, res) {
    try {
      const actions = await EcoAction.findAll();
      res.json(actions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async logAction(req, res) {
    try {
      const { userId, actionId, quantity = 1 } = req.body;

      if (!userId || !actionId) {
        return res.status(400).json({ error: 'userId and actionId are required' });
      }

      // Get the eco action details
      const ecoAction = await EcoAction.findById(actionId);
      if (!ecoAction) {
        return res.status(404).json({ error: 'Action not found' });
      }

      // Calculate total impact
      const co2SavedTotal = ecoAction.co2Saved * quantity;
      const waterSavedTotal = ecoAction.waterSaved * quantity;
      const wasteSavedTotal = ecoAction.wasteSaved * quantity;

      // Create user action
      const userAction = await UserAction.create({
        userId,
        actionId,
        quantity,
        co2SavedTotal,
        waterSavedTotal,
        wasteSavedTotal
      });

      // Update or create user
      let user = await User.findByUserId(userId);
      if (!user) {
        user = await User.create({ userId, username: userId });
      }

      // Update totals
      const updatedUser = {
        ...user,
        totalCO2Saved: user.totalCO2Saved + co2SavedTotal,
        totalWaterSaved: user.totalWaterSaved + waterSavedTotal,
        totalWasteSaved: user.totalWasteSaved + wasteSavedTotal
      };

      // Update streak
      streakService.updateStreak(updatedUser, userAction.date);

      await User.update(userId, updatedUser);

      res.status(201).json({
        userAction,
        user: updatedUser,
        impact: {
          co2: co2SavedTotal,
          water: waterSavedTotal,
          waste: wasteSavedTotal
        },
        insight: impactCalculator.generateInsight({
          co2: co2SavedTotal,
          water: waterSavedTotal,
          waste: wasteSavedTotal
        })
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserActions(req, res) {
    try {
      const { userId } = req.params;
      const { period = 'week' } = req.query;

      let startDate = new Date();
      if (period === 'today') {
        startDate.setHours(0, 0, 0, 0);
      } else if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      }

      const actions = await UserAction.findByUserId(userId, {
        startDate,
        sort: 'date-desc'
      });

      const totalImpact = impactCalculator.calculateTotalImpact(actions);
      const insights = impactCalculator.generateInsight(totalImpact);

      res.json({
        actions,
        totalImpact,
        insights
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserStats(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findByUserId(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ActionController();
