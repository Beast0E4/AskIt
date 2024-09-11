const Comments = require("../models/comments.model");
const Questions = require("../models/ques.model");
const Solutions = require("../models/solution.model");
const User = require("../models/user.model");

const createComment = async (data) => {
    try {
        let commentObj;
        const user = User.findById(data.userId);
        if(!user){
            console.log('No user'); return;
        }
        if(data.questionId){
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
        if(data.solutionId){
            const ques = Solutions.findById(data.solutionId);
            if(!user){
                console.log('No solution'); return;
            }
            commentObj = {
                userId: data.userId,
                solutionId: data.solutionId,
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

const deleteComment = async(id) => {
    try {
        const comment = Comments.findByIdAndDelete(id);
        return comment;
    } catch (error) {
        throw error;
    }
}

module.exports = { createComment, getComments, deleteComment }