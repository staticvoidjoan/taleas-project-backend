const mongoose = require("mongoose");

const EmployerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  email: {
    type:String,
    required: true
  },
  industry: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
  },
  // subscriptionPlan: {
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'SubscriptionPlan' 
  // },
  // startDate: { 
  //   type: Date,
  //   default: Date.now
  // },
  // subscriptionEndDate: {
  //   type: Date,
  //   required: true,
  // }
});

EmployerSchema.methods.isSubscriptionExpired = function() { // Add this method
  const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  return now - this.startDate > oneMonthInMilliseconds;
};

module.exports = mongoose.model("Employer", EmployerSchema);
