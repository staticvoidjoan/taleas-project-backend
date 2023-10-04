const mongoose = require("mongoose");


const History = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: "users"
    }, 
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Post"
    }], 
    dislikedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Post",
        expires: 60
    }]
})

module.exports = mongoose.model("history", History);