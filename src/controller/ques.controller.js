const { StatusCodes } = require("http-status-codes");
const { createQuestion } = require("../services/ques.service")

exports.createQuestion = async (req, res, next) => {
    try {
        const response = await createQuestion(req.body);
        console.log(req.body);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Successfully created a new user",
            error: {},
            data: response
        });
    } catch (error) {
        next(error);
    }
}