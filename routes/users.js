const mongoose = require('mongoose');
const plm = require("passport-local-mongoose")
mongoose.connect("mongodb+srv://root:Shubu%40123@testing.rdqvgba.mongodb.net/printestdata")
    .then((res) => console.log('database connected'))
    .catch((err) => console.log(err));


const pinSchema = new mongoose.Schema({
    username: {
        type: String
    },
    user: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    profileImage: {
        type: String
    },
    contact: {
        type: Number
    },
    boards: {
        type: Array,
        default: []
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }]

})
pinSchema.plugin(plm);

const modelData = new mongoose.model("user", pinSchema)

module.exports = modelData;