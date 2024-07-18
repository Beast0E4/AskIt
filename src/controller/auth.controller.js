const { StatusCodes } = require('http-status-codes');
const { createUser, verifyUser, updateUser } = require('../services/user.service');
require('dotenv').config();
const jwt = require('jsonwebtoken')

exports.signup = async (req, res, next) => {
    try {
        console.log(req.body);
        const response = await createUser(req.body);
        return res.status(StatusCodes.CREATED).send(response);
    } catch (error) {
        next(error);
    }
}

exports.signin = async (req, res, next) => {
    try {
        const result = await verifyUser(req.body);
        const token = jwt.sign({email: req.body.email}, process.env.JWT_SECRET_KEY);
        console.log('result is ',result);
        return res.status(StatusCodes.OK).send({
            message: "User validated",
            token: token,
            userData: result
        });
    } catch (error) {
        next(error);
    }
}
