const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questionId: {
        type: String,
        required: true,
        default: "none"
    },
    answerId: {
        type: String,
        required: true,
        default: "none"
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

const Comments = mongoose.model('Comments', commentSchema);

module.exports = Comments;