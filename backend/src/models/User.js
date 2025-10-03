const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastActionDate: {
    type: Date
  },
  totalCO2Saved: {
    type: Number,
    default: 0
  },
  totalWaterSaved: {
    type: Number,
    default: 0
  },
  totalWasteSaved: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
