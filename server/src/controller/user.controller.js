const { StatusCodes } = require('http-status-codes');
const userService = require('../services/user.service')

exports.updateUser = async (req, res, next) => {
    try {
        const result = await userService.updateUser(req.body, req.file);
        if(result.error) return res.status(StatusCodes.FORBIDDEN).json({
            error: result.error
        })
        res.status(StatusCodes.OK).send({
            success: true,
            message: "Successfully updated the user",
            error: {},
            data: result
        });
    } catch (error) {
        next(error);
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const result = await userService.getUser(req.params);
        res.status(StatusCodes.OK).send(result);
    } catch (error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    try {
        const result = await userService.getUsers();
        res.status(StatusCodes.OK).send({
            users: result
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const result = await userService.deleteUser(req.params);
        if(result) res.status(StatusCodes.OK).send({
            success: true,
            message: "Successfully deleted the user",
            error: {},
            data: result
        });
    } catch (error) {
        next(error);
    }
}

exports.followUser = async (req, res, next) => {
    try {
        console.log('Req:', req.body);
        const result = await userService.followUser(req.body.userId, req.body.myId);
        if(result) res.status(StatusCodes.CREATED).send({
            following: result
        })
    } catch (error) {
        next(error);
    }
}

exports.unFollowUser = async (req, res, next) => {
    try {
        const result = await userService.unFollowUser(req.body.userId, req.body.myId);
        if(result) res.status(StatusCodes.CREATED).send({
            following: result
        })
    } catch (error) {
        next(error);
    }
}

exports.saveQuestion = async(req, res, next) => {
    try {
        const result = await userService.saveQuestion(req.body.userId, req.body.questionId);
        res.status(StatusCodes.ACCEPTED).send({
            saved: result
        })
    } catch (error) {
        throw error;
    }
}

exports.getVoted = async(req, res, next) => {
    try {
        const result = await userService.getVoted(req.params.id);
        res.status(StatusCodes.OK).send({
            fetched: result
        })
    } catch (error) {
        throw error;
    }
}