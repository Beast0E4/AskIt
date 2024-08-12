const Questions = require("../models/ques.model");
const Solutions = require("../models/solution.model");
const User = require("../models/user.model");

const createSolution = async(data) => {
    try {
        const user = User.findById(data.userId);
        const ques = Questions.findById(data.questionId);
        if(!user || !ques){
            console.log('No user or no question'); return;
        }
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

const updateSolution = async (user, req) => {
    try {
        const res = await Solutions.findByIdAndUpdate(user.id, {
            solution: req.solution
        });
        return res;
    } catch (error) {
        throw error;
    }
}

const getSolution = async(sol) => {
    try {
        const soln = await Solutions.findById(sol.id);
        return soln;
    } catch (error) {
        throw error;
    }
}

const deleteSolution = async(sol) => {
    try {
        const soln = await Solutions.findByIdAndDelete(sol.id);
        return soln;
    } catch (error) {
        throw error;
    }
}

const getSolutionByQuestion = async(quesId) => {
    try {
        const sol = await Solutions.find({questionId: quesId});
        return sol;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createSolution, updateSolution, deleteSolution, getSolution, getSolutionByQuestion
}