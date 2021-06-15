// User Schema
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    likedBy: {
        type: [ObjectId],
        unique: true,
    },
    dislikedBy: {
        type: [ObjectId],
        unique: true,
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
