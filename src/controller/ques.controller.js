const { StatusCodes } = require("http-status-codes");
const { createQuestion, updateQuestion } = require("../services/ques.service")

exports.createQuestion = async (req, res, next) => {
    try {
        const response = await createQuestion(req.body);
        console.log(req.body);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Successfully created the question",
            error: {},
            data: response
        });
    } catch (error) {
        next(error);
    }
}

exports.updateQuestion = async (req, res, next) => {
    try {
        const response = await updateQuestion(req.params, req.body);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully updated the question",
            error: {},
            data: response
        });
    } catch (error) {
        next(error);
    }
}