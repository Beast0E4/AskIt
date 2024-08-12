const { StatusCodes } = require("http-status-codes");
const { like, unLike } = require("../services/likes.service");

exports.like = async (req, res, next) => {
    try {
        console.log('Incoming: ', req.body);
        const response = await like(req.body);
        res.status(StatusCodes.OK).send({
            likes: response
        });
    } catch (error) {
        console.log('Error is ', error);
    }
}

exports.unLike = async (req, res, next) => {
    try {
        const response = await unLike(req.body);
        res.status(StatusCodes.OK).send({
            likes: response
        });
    } catch (error) {
        throw error;
    }
}