import mongoose from 'mongoose'

const Contact = mongoose.model(
    'contact',
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true
        }
    })
)

module.exports = Contact ;