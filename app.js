const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'PiperChat Bot';

io.on('connection', socket => {
    console.log('new connection...')


    socket.emit('message', formatMessage(botName, 'Welcome to PiperChat'));


    //Broadcast when user connects
    socket.broadcast.emit('message', formatMessage(botName, 'A user has connected'));
    
    //when user disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, "User left chat"));
    });

    //listen to chat message
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg));
    });

});

server.listen(process.env.PORT || 3000, () => console.log("starting......."));