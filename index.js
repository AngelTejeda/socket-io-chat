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

  socket.on('login', (data) => {
    socket.emit('chat-messages', {
      messages: messages
    });

    io.emit('new-user', {
      id: data.id,
      user: data.user
    });
  });

  socket.on('new-message', (data) => {
    let newMessage = {
      id: data.id,
      user: data.user,
      text: data.text,
      date: Date.now()
    };

    messages.push(newMessage);

    setTimeout(() => {
      io.emit('replicate-message', newMessage);
    }, 3000);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});