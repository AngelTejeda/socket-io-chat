const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('new connection: ' + socket.id);

  // io.emit('prueba', { data: "Hola" });
  socket.on('user-data', (data) => {
    console.log(data);
  });

  socket.emit('start', { data: socket.id });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});