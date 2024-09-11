const { StatusCodes } = require('http-status-codes');
const { createUser, verifyUser } = require('../services/user.service');
require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const response = await createUser(req.body, req.file);
        if(response.error) return res.status(StatusCodes.FORBIDDEN).send({
            error: "User present"
        })
        return res.status(StatusCodes.CREATED).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

exports.signin = async (req, res) => {
    try {
        const result = await verifyUser(req.body);
        let statusCode;
        let response;
        if(result.error){
            statusCode = 401;
            response = result.error;
        }else{
            statusCode = 201;
            const token = jwt.sign({email: req.body.email}, process.env.JWT_SECRET_KEY);
            response = {
                message: "user validated",
                token: token,
                userData: result.userData
            };
        }
        res.status(statusCode).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}
