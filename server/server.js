const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public'); // this will bring us to the public folder nicely
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app); // in the backend, express uses the HTTP module to create the server; thus, we can also create the server directly by calling http.createServer method.
let io = socketIO(server); // we get back a websocket server, and we will use this to admit and emit events and communicate between the server and the client. When we integrate socket.io with our server, we get a couple of cool things on the front-end. First, we get a route that accepts incoming websocket connections, and we also get access to a js library that makes it easy to work with socket.io on the client side.

app.use('/', express.static(publicPath)); // we are using the express.static built-in middleware function to serve static files

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', {
        from: 'tino@example.com',
        text: 'This is a new message!',
        createdAt: 123
    }); // emit is essentially creating an event. Here we are emitting a newMessage event from the server to the client

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('createMessage', (message) => {
        console.log('User created this message: ', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        }); // This sets the server to broadcast a newMessage event to all of the connected users
    }); // this sets the server to listen to createMessage events created by the client
});

server.listen(port, () => {
    console.log('Listening on port ' + port);
});
