const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userId: {
        type: String,
        trim: true,
    },
    body: {
        type: String,
        trim: true,
    },
    time: {
        type: String,
        trim: true,
    },
})

const Post = mongoose.model('Post', userSchema)

module.exports = { Post }