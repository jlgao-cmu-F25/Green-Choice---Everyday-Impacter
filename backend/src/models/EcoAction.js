const mongoose = require('mongoose');

const ecoActionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['transportation', 'waste', 'food', 'energy', 'water'],
    required: true
  },
  co2Saved: {
    type: Number,
    required: true,
    comment: 'CO2 saved in kg'
  },
  waterSaved: {
    type: Number,
    default: 0,
    comment: 'Water saved in liters'
  },
  wasteSaved: {
    type: Number,
    default: 0,
    comment: 'Waste reduced in kg'
  },
  icon: String,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('EcoAction', ecoActionSchema);
