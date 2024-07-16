const { StatusCodes } = require('http-status-codes');
const { createUser, verifyUser, updateUser } = require('../services/user.service');
require('dotenv').config();
const jwt = require('jsonwebtoken')

exports.signup = async (req, res, next) => {
    try {
        console.log(req.body);
        const response = await createUser(req.body);
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

exports.signin = async (req, res, next) => {
    try {
        const result = await verifyUser(req.body);
        const token = jwt.sign({email: req.body.email}, process.env.JWT_SECRET_KEY);
        return res.status(StatusCodes.OK).json({
            message: "User validated",
            token: token,
            userData: result.userData
        });
    } catch (error) {
        next(error);
    }
}
