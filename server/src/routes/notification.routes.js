const { isUserAuthenticated } = require("../validators/auth.validator")
const notificationController = require ('../controller/notification.controller');

module.exports = function (app) {
    app.get ('/notification/getNotifications/:userId', isUserAuthenticated, notificationController.getNotifications);
}