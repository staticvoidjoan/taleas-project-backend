const mongoose = require("mongoose");

const Certifications = new mongoose.Schema({
    title: {
        type: String,
    },
    organization: {
        type: String,
    },
    issueDate: {
        type: String,
    },
    expirationDate: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false, 
    }
});

module.exports = mongoose.model("certifications", Certifications);