const { StatusCodes } = require('http-status-codes');
const commentService = require('../services/comments.service')

exports.createComment = async (req, res, next) => {
    try {
        const response = await commentService.createComment(req.body);
        res.status(StatusCodes.CREATED).send({
            data: response
        });
    } catch (error) {
        next(error);
    }
}

exports.getComments = async (req, res, next) => {
    try {
        const response = await commentService.getComments();
        res.status(StatusCodes.OK).send({
            data: response
        })
    } catch (error) {
        throw error;
    }
}