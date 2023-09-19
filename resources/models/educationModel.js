const mongoose = require("mogoose")
const Education = new mongoose.Schema({
    title: {
        type: String, 
        required: True,
    }, 
    startDate: {
        type: Date,
        required: True, 
    },
    endDate: {
        type: Date,
        required: False, 
    }, 
    description: {
        type: String, 
        required: True, 
    }

})

module.exports = mongoose.model("education", Education);