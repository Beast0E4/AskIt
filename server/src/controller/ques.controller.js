const { StatusCodes } = require("http-status-codes");
const { createQuestion, deleteQuestion, getAllQuestions, getQuestion } = require("../services/ques.service")
const { getLikedQuestions } = require('../services/likes.service')

exports.createQuestion = async (req, res, next) => {
    try {
        const response = await createQuestion(req.body, req.file);
        res.status(StatusCodes.CREATED).send({
            question: response
        });
    } catch (error) {
        next(error);
    }
}

exports.getAllQuestions = async (req, res, next) => {
    try {
        const response = await getAllQuestions();
        res.status(StatusCodes.CREATED).send({
            question: response
        });
    } catch (error) {
        next(error);
    }
}

exports.getQuestion = async (req, res, next) => {
    try {
        const response = await getQuestion(req.params);
        res.status(StatusCodes.CREATED).send({
            question: response
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteQuestion = async (req, res, next) => {
    try {
        const response = await deleteQuestion(req.params);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully deleted the question",
            error: {},
            data: response
        });
    } catch (error) {
        next(error);
    }
}

exports.getLikes = async(req, res, next) => {
    try {
        const response = await getLikedQuestions(req.params);
        return res.status(StatusCodes.CREATED).send({
            likedQuestion: response
        })
    } catch (error) {
        next(error);
    }
}