const { StatusCodes } = require("http-status-codes");
const { createSolution, updateSolution, deleteSolution, getSolution, getSolutionByQuestion, getSolutionByUser } = require("../services/solution.service");
const { getLikedSolutions } = require("../services/likes.service");

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

exports.getSolutionByQuestion = async (req, res, next) => {
    try {
        const response = await getSolutionByQuestion(req.params.id);
        res.status(StatusCodes.CREATED).send({
            data: response
        });
    } catch (error) {
        next(error);
    }
}

exports.getSolution = async (req, res, next) => {
    try {
        const response = await getSolution(req.params);
        res.status(StatusCodes.CREATED).send({
            data: response
        });
    } catch (error) {
        next(error);
    }
}

exports.getSolutionByUser = async (req, res, next) => {
    try {
        const response = await getSolutionByUser(req.params);
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
        return res.status(StatusCodes.OK).send({
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

exports.getLikes = async(req, res, next) => {
    try {
        const response = await getLikedSolutions(req.params);
        return res.status(StatusCodes.CREATED).send({
            likedSolution: response
        })
    } catch (error) {
        next(error);
    }
}