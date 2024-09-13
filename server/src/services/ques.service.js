const cloudinary = require("../config/cloudinary.config");
const Likes = require("../models/likes.model");
const Questions = require("../models/ques.model");
const Solutions = require("../models/solution.model");
const User = require("../models/user.model");

const createQuestion = async(data, file) => {
    try {
        const user = await User.findById(data.userId);
        if(!user){
            console.log('No user'); return;
        }
        let result = null;
        if(file){
            result = await cloudinary.uploader.upload(file.path, {
                folder: 'question_images',
            });
        }
        const quesObj = {
            userId: data.userId,
            title: data.title,
            question: data.question,
            topic: data.topic,
            image: result?.secure_url,
            repost: data.repost ? data.repost : null
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
        res.forEach(async (sol) => {
            await Likes.deleteMany({solutionId: sol.id});
        })
        const quest = await Questions.findById(ques.id);
        if(quest.image){
            const publicId = quest.image.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
        await Solutions.deleteMany({questionId: ques.id});
        await Likes.deleteMany({questionId: ques.id})
        const question = await Questions.findByIdAndDelete(ques.id);
        return question;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createQuestion, deleteQuestion, getAllQuestions, getQuestion
}