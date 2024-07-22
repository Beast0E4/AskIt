const { StatusCodes } = require("http-status-codes");
const { createSolution, updateSolution, deleteSolution, getSolution } = require("../services/solution.service");

exports.createSolution = async (req, res, next) => {
    try {
        const response = await createSolution(req.body);
        res.status(StatusCodes.CREATED).send({
            data: response
        });
    } catch (error) {
        next(error);
    }
}

exports.getSolution = async (req, res, next) => {
    try {
        const response = await getSolution(req.params.id);
        res.status(StatusCodes.CREATED).send({
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