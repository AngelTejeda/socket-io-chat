const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let messages = [];

io.on('connection', (socket) => {
  console.log('New connection: ' + socket.id);

  socket.on('user-data', (data) => {
    console.log(data);
  });

  socket.on('send-message', (data) => {
    let newMessage = {
      user: data.user,
      message: data.message,
      date: Date.now()
    };

    messages.push(newMessage);

    io.emit('new-message', newMessage);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});