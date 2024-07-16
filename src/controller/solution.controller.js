const { StatusCodes } = require("http-status-codes");
const { createSolution } = require("../services/solution.service");

exports.createSolution = async (req, res, next) => {
    try {
        console.log(req.body);
        const response = await createSolution(req.body);
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