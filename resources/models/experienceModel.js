const mongoose = require("mongoose");

const Experience = new mongoose.Schema({
    employer: {
        type: String,
        required: true, 
    }, 
    position: {
        type: String,
        required: true, 
    },
    startDate: {
        type: Date,
        required: true, 
    },
    endDate: {
        type: Date,
        required: false, 
    },
    description: {
        type: String,
        required: true, 
    }
});

module.exports = mongoose.model("experience", Experience);