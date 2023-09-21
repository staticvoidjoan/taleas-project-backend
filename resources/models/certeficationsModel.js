const mongoose = require("mongoose");

const Certifications = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    issueDate: {
        type: Date,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: false,
    },
    description: {
        type: String,
        required: false, 
    }
});

module.exports = mongoose.model("certifications", Certifications);