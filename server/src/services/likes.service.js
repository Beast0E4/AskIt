const Comments = require("../models/comments.model");
const Likes = require("../models/likes.model");
const Questions = require("../models/ques.model");
const Solutions = require("../models/solution.model");

const like = async(data) => {
    try {
        if(data.quesId){
            console.log(data);
            const likes = await Questions.updateOne({_id : data.quesId}, {$inc : {likes : 1}});
            const addLike = await Likes.create({
                userId: data.userId,
                questionId: data.quesId
            })
            return likes
        }
        if(data.solId){
            const likes = await Solutions.updateOne({_id : data.solId}, {$inc : {likes : 1}});
            const addLike = await Likes.create({
                userId: data.userId,
                solutionId: data.solId
            })
            return likes
        }
        if(data.commentId){
            const likes = await Comments.updateOne({_id : data.commentId}, {$inc : {likes : 1}});
            const addLike = await Likes.create({
                userId: data.userId,
                commentId: data.commentId
            })
            return likes;
        }
        return null;
    } catch (error) {
        throw error;
    }
}

const unLike = async(data) => {
    try {
        if(data.quesId){
            const likes = await Questions.updateOne({_id : data.quesId}, {$inc : {likes : -1}});
            const addLike = await Likes.findOneAndDelete({questionId: data.quesId, userId: data.userId});
            return likes
        }
        if(data.solId){
            const likes = await Solutions.updateOne({_id : data.solId}, {$inc : {likes : -1}});
            const addLike = await Likes.findOneAndDelete({solutionId: data.solId, userId: data.userId});
            return likes
        }
        if(data.commentId){
            const likes = await Comments.updateOne({_id : data.commentId}, {$inc : {likes : -1}});
            const addLike = await Likes.findOneAndDelete({commentId: data.commentId, userId: data.userId});
            return likes
        }
        return null;
    } catch (error) {
        throw error;
    }
}

const getLikedComments = async(id) => {
    try {
        const comment = await Likes.find({solutionId: 'none', questionId: 'none', userId: id});
        return comment;
    } catch (error) {
        throw error;
    }
}

const getLikedQuestions = async(data) => {
    try {
        const likes = await Likes.find({solutionId: 'none', commentId: 'none', userId: data.id});
        return likes
    } catch (error) {
        throw error;
    }
}

const getLikedSolutions = async(data) => {
    try {
        const likes = await Likes.find({questionId: 'none', userId: data.id});
        return likes
    } catch (error) {
        throw error;
    }
}

module.exports = {
    like, unLike, getLikedQuestions, getLikedSolutions, getLikedComments
}