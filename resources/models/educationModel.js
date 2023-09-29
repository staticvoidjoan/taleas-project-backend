const mongoose = require("mongoose")
const Education = new mongoose.Schema({
    institution: {
        type: String, 
    },
    degree: {
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

})

module.exports = mongoose.model("education", Education);