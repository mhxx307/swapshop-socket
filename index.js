const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    const user = users.find((user) => user.userId === userId);
    if (!user) {
        console.log(`User with userId ${userId} not found`);
    }
    return user;
};

io.on("connection", (socket) => {
    console.log("New client connected " + socket.id);

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        console.log("userId addUser", userId);
        console.log("socketId addUser", socket.id);
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    // send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        console.log("data from client", { senderId, receiverId, text });
        console.log("all users", users);
        const user = getUser(receiverId);
        console.log("user receiver socket id", user.socketId);
        io.to(user.socketId).emit("getMessage", { senderId, receiverId, text });
        console.log(`Sent message to user with socket ID ${user.socketId}`);
    });

    //  disconnect
    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
});

server.listen(process.env.PORT || 8900, () => {
    console.log("Server is running on port 8900");
});
