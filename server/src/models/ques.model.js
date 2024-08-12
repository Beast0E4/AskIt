const mongoose = require('mongoose');

const quesSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true
    },
    likes:{
        type: Number,
        required: true,
        default: 0
    },
    createdAt:{
        type: Date,
        immutable: true,
        default: Date.now,
    }
});

const Questions = mongoose.model('Questions', quesSchema);

module.exports = Questions;