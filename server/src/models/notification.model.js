const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    reciever: [
        {
            type: String,
            required: true
        }
    ],
    type: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now,
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;