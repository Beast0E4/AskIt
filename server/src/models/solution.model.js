const mongoose = require('mongoose');

const solSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    solution: {
        type: String,
        required: true
    },
    questionId: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    likes:{
        type: Number,
        required: true,
        default: 0
    },
    verified:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        immutable: true,
        default: Date.now,
    }
});

const Solutions = mongoose.model('Solutions', solSchema);

module.exports = Solutions;