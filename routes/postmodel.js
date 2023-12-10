const mongoose = require('mongoose');

const postModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    }


})


const postSchema = new mongoose.model("post", postModel)

module.exports = postSchema;