/*
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server({
  cors: {
    origin: "http://localhost:3000"
  }
});


io.on('connection', (socket) => {
  console.log('a user connected');
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(4000, () => {
  console.log('listening on :4000');
});

*/
import { Server } from "socket.io";

const io = new Server({
    cors: {
      origin: "http://localhost"
    }
});

io.on("connection", (socket) => {
  console.log("Connection");
});
  
io.listen(4000);