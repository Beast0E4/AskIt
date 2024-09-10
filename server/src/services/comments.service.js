const Comments = require("../models/comments.model");
const Questions = require("../models/ques.model");
const User = require("../models/user.model");

const createComment = async (data) => {
    try {
        let commentObj;
        const user = User.findById(data.userId);
        if(!user){
            console.log('No user'); return;
        }
        if(data.questionId !== "none"){
            const ques = Questions.findById(data.questionId);
            if(!user){
                console.log('No question'); return;
            }
            commentObj = {
                userId: data.userId,
                questionId: data.questionId,
                description: data.description
            }
        }
        const response = Comments.create(commentObj);
        return response;
    } catch (error) {
        throw error;
    }
}

const getComments = async () => {
    try {
        const comments = Comments.find();
        return comments;
    } catch (error) {
        throw error;
    }
}

module.exports = { createComment, getComments }