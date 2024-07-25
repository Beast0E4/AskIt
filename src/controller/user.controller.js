const { StatusCodes } = require('http-status-codes');
const userService = require('../services/user.service')

exports.updateUser = async (req, res, next) => {
    try {
        const result = await userService.updateUser(req.body);
        if(result.error) return res.status(StatusCodes.FORBIDDEN).json({
            error: "User present"
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
        res.status(StatusCodes.OK).send({
            success: true,
            message: "Successfully deleted the user",
            error: {},
            data: result
        });
    } catch (error) {
        next(error);
    }
}