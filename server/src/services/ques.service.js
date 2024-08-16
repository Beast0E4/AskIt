const Likes = require("../models/likes.model");
const Questions = require("../models/ques.model");
const Solutions = require("../models/solution.model");
const User = require("../models/user.model");

const createQuestion = async(data) => {
    try {
        const user = await User.findById(data.userId);
        if(!user){
            console.log(data);
            console.log('No user'); return;
        }
        const quesObj = {
            userId: data.userId,
            question: data.question,
        }
        const response = Questions.create(quesObj);
        return response;
    } catch (error) {
        throw error;
    }
}

const getAllQuestions = async(data) => {
    try {
        const response = Questions.find();
        return response;
    } catch (error) {
        throw error;
    }
}

const getQuestion = async(data) => {
    try {
        const response = Questions.findById(data.id);
        return response;
    } catch (error) {
        throw error;
    }
}

const deleteQuestion = async(ques) => {
    try {
        const res = await Solutions.find({questionId: ques.id});
        console.log('Check: ', res);
        res.forEach(async (sol) => {
            await Likes.deleteMany({solutionId: sol.id});
        })
        await Solutions.deleteMany({questionId: ques.id});
        await Likes.deleteMany({questionId: ques.id})
        const quest = await Questions.findByIdAndDelete(ques.id);
        return quest;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createQuestion, deleteQuestion, getAllQuestions, getQuestion
}