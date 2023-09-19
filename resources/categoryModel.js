const mongoose = require('mongoose')

const Category = mongoose.model(
    "caategory",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
        }
    })
)