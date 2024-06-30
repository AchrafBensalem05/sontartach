const socketIo = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (userId) => {
      console.log(`User ${userId} joined room`);
      socket.join(userId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

const getIo = () => io;

module.exports = { initSocket, getIo };
