const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/admin.html');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('state change', (msg) => {
    const [light, state] = msg.split(':')
    console.log(`light ${light} will be set to ${state}`)
    socket.broadcast.emit('state change', msg)
  });

  socket.on('unlock', () => {
    console.log('unlocking door')
    socket.broadcast.emit('unlock')
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});