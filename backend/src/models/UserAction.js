const mongoose = require('mongoose');

const userActionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  actionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EcoAction',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  co2SavedTotal: Number,
  waterSavedTotal: Number,
  wasteSavedTotal: Number
}, {
  timestamps: true
});

// Index for efficient querying
userActionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('UserAction', userActionSchema);
