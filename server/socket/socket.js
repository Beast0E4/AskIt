const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { FRONT_URL } = require('../src/config/server.config');

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
        onlineUsers.delete(socket.id);
        io.emit("online-users", Array.from(onlineUsers.values()));
    };

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
    });
}

module.exports = setupSocket;
