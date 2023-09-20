const mongoose = require("mongoose");

const Employer = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  membershipPlan: {
    type: String,
    required: false,
  }
});

module.exports = mongoose.model("Employer", Employer);