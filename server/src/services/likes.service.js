const Likes = require("../models/likes.model");
const Questions = require("../models/ques.model");
const Solutions = require("../models/solution.model");

const like = async(data) => {
    try {
        console.log('Data is: ', data);
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
        return null;
    } catch (error) {
        throw error;
    }
}

const getLikes = async() => {
    try {
        const res = await Likes.find();
        return res;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    like, unLike, getLikes
}