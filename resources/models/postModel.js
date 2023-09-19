const mongoose = require("mongoose");

const Post = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    ref: "category"
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Employer"
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  }],
  recLikes: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  }],
  position: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true,
  }],
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Post", Post);