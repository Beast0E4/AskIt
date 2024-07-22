const { StatusCodes } = require("http-status-codes");
const { createQuestion, deleteQuestion, getAllQuestions, getQuestion } = require("../services/ques.service")

exports.createQuestion = async (req, res, next) => {
    try {
        const response = await createQuestion(req.body);
        console.log(req.body);
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
        console.log(req.params);
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