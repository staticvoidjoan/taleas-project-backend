const mongoose = require("mongoose")
const Education = new mongoose.Schema({
    institution: {
        type: String, 
    },
    degree: {
        type: String,
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
        required: false, 
    }, 
    description: {
        type: String, 
        required: false, 
    }

})

module.exports = mongoose.model("education", Education);