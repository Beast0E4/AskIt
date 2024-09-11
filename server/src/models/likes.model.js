const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    questionId: {
        type: String,
        default: 'none'
    },
    solutionId: {
        type: String,
        default: 'none'
    },
    commentId: {
        type:String,
        default: 'none'
    },
    createdAt:{
        type: Date,
        immutable: true,
        default: Date.now,
    }
});

const Likes = mongoose.model('Likes', likesSchema);

module.exports = Likes;