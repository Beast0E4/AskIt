const Questions = require("../models/ques.model");
const User = require("../models/user.model");

const createQuestion = async(data) => {
    try {
        const user = await User.findById(data.userId);
        if(!user){
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

const updateQuestion = async (user, req) => {
    try {
        await Questions.findOneAndUpdate({_id: user.id}, {
            question: req.question
        });
        return Questions.findById(user.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createQuestion, updateQuestion
}