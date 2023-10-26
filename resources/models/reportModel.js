const mongoose = require('mongoose');

const Report = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    userBeingReported:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Employer"
    },
    reportReason: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: false,
        default: Date.now(),
    },
    reportCount: {
        type: Number,
        deafult: 0,
    },
});

module.exports = mongoose.model("report", Report);