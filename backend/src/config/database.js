const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/everyday-impact');

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed initial eco actions if none exist
    const EcoAction = require('../models/EcoAction');
    const count = await EcoAction.countDocuments();

    if (count === 0) {
      await seedEcoActions();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedEcoActions = async () => {
  const EcoAction = require('../models/EcoAction');

  const defaultActions = [
    {
      name: 'Biked 1 mile',
      category: 'transportation',
      co2Saved: 0.4,
      waterSaved: 0,
      wasteSaved: 0,
      icon: '🚴',
      description: 'Chose biking over driving'
    },
    {
      name: 'Skipped plastic bag',
      category: 'waste',
      co2Saved: 0.01,
      waterSaved: 0,
      wasteSaved: 0.1,
      icon: '🛍️',
      description: 'Used reusable bag instead'
    },
    {
      name: 'Recycled bottle',
      category: 'waste',
      co2Saved: 0.05,
      waterSaved: 0.5,
      wasteSaved: 0.05,
      icon: '♻️',
      description: 'Recycled plastic bottle'
    },
    {
      name: 'Used reusable mug',
      category: 'waste',
      co2Saved: 0.11,
      waterSaved: 1,
      wasteSaved: 0.02,
      icon: '☕',
      description: 'Avoided disposable cup'
    },
    {
      name: 'Ate vegetarian meal',
      category: 'food',
      co2Saved: 2.5,
      waterSaved: 100,
      wasteSaved: 0.2,
      icon: '🥗',
      description: 'Chose plant-based option'
    }
  ];

  await EcoAction.insertMany(defaultActions);
  console.log('Seeded default eco actions');
};

module.exports = connectDB;
