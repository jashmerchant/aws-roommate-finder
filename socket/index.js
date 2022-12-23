const io = require("socket.io")(3001, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("join", (room, cb) => {
        socket.join(room);
        cb(`Joined ${room}`);
    });
    socket.on("send-message", (message, room) => {
        socket.to(room).emit("receive-message", message);
        console.log("sending", message);
    });
});