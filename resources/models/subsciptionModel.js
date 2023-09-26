const mongoose = require('mongoose');

const SubscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['basic', 'medium', 'premium']
  },
  posts: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);
