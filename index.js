const io = require("socket.io")(8900, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:4000/graphql"],
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
    console.log("connected");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        console.log(userId, "userId adduser");
        console.log(socket.id, "socketid adduser");
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    // send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        console.log(users);
        if (senderId) {
            const user = getUser(senderId);
            console.log(user, "user");
            console.log(receiverId, "receiverId");
            console.log(senderId, "senderId");
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        }
    });

    //  disconnect
    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
