const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    userId: {
        type: String,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
    },
    passwordCheck: {
        type: String,
        trim: true,
    },
})

const User = mongoose.model('User', userSchema)

module.exports = { User }