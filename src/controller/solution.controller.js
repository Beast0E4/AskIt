const { StatusCodes } = require("http-status-codes");
const { createSolution, updateSolution, deleteSolution } = require("../services/solution.service");

exports.createSolution = async (req, res, next) => {
    try {
        console.log(req.body);
        const response = await createSolution(req.body);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Successfully created the solution",
            error: {},
            data: response
        });
    } catch (error) {
        next(error);
    }
}

exports.updateSolution = async (req, res, next) => {
    try {
        const response = await updateSolution(req.params, req.body);
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

exports.deleteSolution = async (req, res, next) => {
    try {
        const response = await deleteSolution(req.params);
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