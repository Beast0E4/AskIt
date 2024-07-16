const { StatusCodes } = require('http-status-codes');
const userService = require('../services/user.service')

exports.updateUser = async (req, res, next) => {
    try {
        const result = await userService.updateUser(req.body);
        return res.status(StatusCodes.OK).json({
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
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully fetched the user",
            error: {},
            data: result
        });
    } catch (error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        console.log(req.params);
        const result = await userService.deleteUser(req.params);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Successfully deleted the user",
            error: {},
            data: result
        });
    } catch (error) {
        next(error);
    }
}