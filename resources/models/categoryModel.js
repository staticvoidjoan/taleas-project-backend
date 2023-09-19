const mongoose = require('mongoose')

const Category = mongoose.model(
    "category",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
        }
    })
)

module.exports = Category; 