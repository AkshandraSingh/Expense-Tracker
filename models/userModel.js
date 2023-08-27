const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        unique: true,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    usedPasswords: {
        type: [],
        default: []
    },
    userGender: {
        type: String,
        default: "male"
    },
    userProfilePic: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },
})

userSchema.set('timestamps', true)

module.exports = mongoose.model('user', userSchema);
