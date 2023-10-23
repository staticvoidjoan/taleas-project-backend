const mongoose = require('mongoose');

const Report = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    employer:{
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
    }
});

module.exports = mongoose.model("report", Report);