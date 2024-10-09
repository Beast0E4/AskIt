const cloudinary = require("../config/cloudinary.config");
const Comments = require("../models/comments.model");
const Likes = require("../models/likes.model");
const Questions = require("../models/ques.model");
const Solutions = require("../models/solution.model");
const User = require("../models/user.model");

const createQuestion = async(data, file) => {
    try {
        console.log('Data: ', data);
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
        if(!data.options?.length){
            const quesObj = {
                userId: data.userId,
                title: data?.title,
                question: data.question,
                topic: data.topic,
                image: result?.secure_url,
                repost: data.repost !== 'null' ? data.repost : 'none'
            }
            const response = Questions.create(quesObj);
            return response;
        } else {
            const quesObj = {
                userId: data.userId,
                title: data.title,
                question: data?.question,
                poll: JSON.parse(data.options).filter((opt) => opt.option?.length > 0),
                topic: data.topic,
                image: result?.secure_url,
                repost: data.repost !== 'null' ? data.repost : 'none'
            }
            const response = Questions.create(quesObj);
            return response;
        }
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
        await User.updateMany({}, {$pull: {savedQuestions: ques.id}});
        const res = await Solutions.find({questionId: ques.id});
        res.forEach(async (sol) => {
            await Likes.deleteMany({solutionId: sol.id});
            await Comments.deleteMany({solutionId: sol.id});
        })
        const quest = await Questions.findById(ques.id);
        if(quest.image){
            const publicId = quest.image.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
        await Comments.deleteMany({questionId: ques.id});
        await Solutions.deleteMany({questionId: ques.id});
        await Likes.deleteMany({questionId: ques.id})
        if(!ques.question){
            quest.poll?.forEach(async(opt) => await User.updateMany({}, {$pull : {voted: opt._id}}));
        }
        const question = await Questions.findByIdAndDelete(ques.id);
        return question;
    } catch (error) {
        throw error;
    }
}

const vote = async (quesId, optId, userId) => {
    try {
        const ques = await Questions.findById(quesId);
        if(!ques){
            console.log('No question'); return;
        }
        const poll = ques.poll.find(p => p._id.toString() === optId);
        poll.votes += 1;
        await User.updateOne({ _id: userId }, {$push: { voted: poll._id }});
        const res = await ques.save();
        return res;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createQuestion, deleteQuestion, getAllQuestions, getQuestion, vote
}