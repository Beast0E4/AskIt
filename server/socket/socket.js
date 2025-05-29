const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { FRONT_URL } = require('../src/config/server.config');
const Notification = require ('../src/models/notification.model')
const { toggleFollow } = require ('../src/services/user.service');

const { setIO, userSocketMap } = require("./socketInstance"); // To set io globally

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: FRONT_URL,
            methods: ["GET", "POST", "DELETE", "PUT"],
        },
    });

    setIO(io); // Make io globally accessible

    // Handle disconnection
    const disconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const followUser = async (data) => {
        const senderSocketId = userSocketMap.get (data.sender);
        const recieverSocketId = userSocketMap.get (data.reciever);

        const following = await toggleFollow (data.reciever, data.sender);

        if (following.includes (data.reciever)) {
            const res = await Notification.create (data);
            io.to(senderSocketId).emit("recieve-notification", res);
            io.to(recieverSocketId).emit("recieve-notification", res);
        }
        else {
            data.type = "unfollow-user"
            io.to(senderSocketId).emit("recieve-notification", data);
            io.to(recieverSocketId).emit("recieve-notification", data);
        }
    }

    io.on("connection", (socket) => {
        console.log(`Socket ${socket.id} connected.`);
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket id: ${socket.id}`);
        } else {
            console.log("User ID not provided during connection.");
        }
        socket.on("disconnect", () => disconnect(socket));

        socket.on ("follow-user", followUser);
    });
}

module.exports = setupSocket;
