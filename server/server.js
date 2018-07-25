const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public'); // this will bring us to the public folder nicely
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app); // in the backend, express uses the HTTP module to create the server; thus, we can also create the server directly by calling http.createServer method.
let io = socketIO(server); // we get back a websocket server, and we will use this to admit and emit events and communicate between the server and the client. When we integrate socket.io with our server, we get a couple of cool things on the front-end. First, we get a route that accepts incoming websocket connections, and we also get access to a js library that makes it easy to work with socket.io on the client side.

app.use('/', express.static(publicPath)); // we are using the express.static built-in middleware function to serve static files

io.on('connection', (socket) => {
    console.log('New user connected');

    // socket.emit('newMessage', {
    //     from: 'tino@example.com',
    //     text: 'This is a new message!',
    //     createdAt: 123
    // }); // emit is essentially creating an event. Here we are emitting a newMessage event from the server to the client

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat room.'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user just joined the chat room'));

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('createMessage', (message, callback) => {
        console.log('User created this message: ', message);
        io.emit('newMessage', generateMessage(message.from, message.text)); // This sets the server to broadcast a newMessage event to all of the connected users
        callback('This is from te server, acknowledging that it received the createMessage event from the client.'); // this is how we can acknowledge
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // }); // broadcast will emit the event to every connected client except the client of the current socket.
    }); // this sets the server to listen to createMessage events created by the client

    socket.on("createLocationMessage", (coords, callback) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
        callback();
    });
});

server.listen(port, () => {
    console.log('Listening on port ' + port);
});
