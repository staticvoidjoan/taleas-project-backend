const mongoose = require("mongoose");

const Certifications = new mongoose.Schema({
    title: {
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

module.exports = mongoose.model("certifications", Certifications);