const mongoose = require("mongoose");

const User = mongoose.model(
  "users",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    education: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "education"
    }],
    experience: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "experience"
    }],
    generalSkills: [{
        type: String,
    }],
    languages: [{
        type: String,
    }],
    certifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "certifications"
    }],
    links: [{
        type: String,
    }],
    profilePhoto: {
        type: String,
    }
  })
);

module.exports = User;