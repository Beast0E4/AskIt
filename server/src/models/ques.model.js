const mongoose = require('mongoose');

const quesSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String, 
        required: false
    },
    question: {
        type: String
    },
    image: {
        type: String
    },
    poll: [
        {
          option: {
            type: String,
            required: true
          },
          votes: {
            type: Number,
            default: 0
          }
        }
    ],
    repost:{
        type: String,
        default: 'none'
    },
    likes:{
        type: Number,
        required: true,
        default: 0
    },
    topic:{
        type: String,
        required: true,
        default: "Miscellaneous",
        enum: ["Technology", "Science and Mathematics", "Health and Medicine", "Education and Learning", "Business and Finance", "Arts and Culture", "History and Geography", "Entertainment and Media", "Current Affairs and Politics", "Philosophy and Ethics", "Lifestyle", "Psychology", "Legal and Regulatory", "Miscellaneous", "Sports"]
   },
    createdAt:{
        type: Date,
        immutable: true,
        default: Date.now,
    }
});

const Questions = mongoose.model('Questions', quesSchema);

module.exports = Questions;