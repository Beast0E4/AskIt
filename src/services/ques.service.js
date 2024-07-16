const Questions = require("../models/ques.model")

const createQuestion = async(data) => {
    try {
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

module.exports = {
    createQuestion
}