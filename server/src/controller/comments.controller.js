const { StatusCodes } = require('http-status-codes');
const commentService = require('../services/comments.service');
const { getLikedComments } = require('../services/likes.service');

exports.createComment = async (req, res, next) => {
    try {
        console.log(req.body);
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

exports.getLikedComments = async (req, res, next) => {
    try {
        const response = await getLikedComments(req.params.id);
        res.status(StatusCodes.OK).send({
            likedComment: response
        })
    } catch (error) {
        throw error;
    }
}

exports.deleteComments = async(req, res, next) => {
    try {
        const response = await commentService.deleteComment(req.params.id);
        res.status(StatusCodes.OK).send({
            data: response
        });
    } catch (error) {
        throw error;
    }
}