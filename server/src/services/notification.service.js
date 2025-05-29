const Notification = require("../models/notification.model");

const getNotifications = async (userId) => {
    try {
        const notifications = await Notification.find({reciever: userId});
        return notifications;
    } catch (error) {
        throw error;
    }
}

module.exports = { getNotifications }