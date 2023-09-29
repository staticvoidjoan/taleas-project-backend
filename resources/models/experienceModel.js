const mongoose = require("mongoose");

const Experience = new mongoose.Schema({
    employer: {
        type: String,
    }, 
    position: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
        required: false, 
    },
    description: {
        type: String,
        required: false, 
    }
});

module.exports = mongoose.model("experience", Experience);