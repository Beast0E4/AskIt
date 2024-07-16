const Solutions = require("../models/solution.model");

const createSolution = async(data) => {
    try {
        const solObj = {
            userId: data.userId,
            questionId: data.questionId,
            solution: data.solution
        }
        const response = Solutions.create(solObj);
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createSolution
}