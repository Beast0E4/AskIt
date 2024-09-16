const Comments = require("../models/comments.model");
const Likes = require("../models/likes.model");
const Questions = require("../models/ques.model");
const Solutions = require("../models/solution.model");
const cloudinary = require("../config/cloudinary.config");
const User = require("../models/user.model");

const createSolution = async(data, file) => {
    try {
        const user = User.findById(data.userId);
        const ques = Questions.findById(data.questionId);
        if(!user || !ques){
            console.log('No user or no question'); return;
        }
        let result = null;
        if(file){
            result = await cloudinary.uploader.upload(file.path, {
                folder: 'solution_images',
            });
        }
        const solObj = {
            userId: data.userId,
            questionId: data.questionId,
            solution: data.solution,
            image: result?.secure_url
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

const getSolutionByUser = async(sol) => {
    try {
        const soln = await Solutions.find({userId : sol.id});
        return soln;
    } catch (error) {
        throw error;
    }
}

const deleteSolution = async(sol) => {
    try {
        await Likes.deleteMany({solutionId: sol.id});
        await Comments.deleteMany({solutionId: sol.id})
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

const verifyAnswer = async(ansId) => {
    try {
        const solution = await Solutions.findById(ansId);
        const sol = await Solutions.findByIdAndUpdate(ansId, {verified: !solution.verified});
        return sol;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createSolution, updateSolution, deleteSolution, getSolution, getSolutionByQuestion, getSolutionByUser, verifyAnswer
}