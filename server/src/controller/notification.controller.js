const { StatusCodes } = require('http-status-codes');
const notificationService = require ('../services/notification.service');

exports.getNotifications = async (req, res, next) => {
    try {
        const response = await notificationService.getNotifications(req.params.userId);
        res.status(StatusCodes.OK).send({
            data: response
        })
    } catch (error) {
        throw error;
    }
}