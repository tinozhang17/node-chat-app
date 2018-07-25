const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public'); // this will bring us to the public folder nicely
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app); // in the backend, express uses the HTTP module to create the server; thus, we can also create the server directly by calling http.createServer method.
let io = socketIO(server); // we get back a websocket server, and we will use this to admit and emit events and communicate between the server and the client. When we integrate socket.io with our server, we get a couple of cool things on the front-end. First, we get a route that accepts incoming websocket connections, and we also get access to a js library that makes it easy to work with socket.io on the client side.
let users = new Users();

app.use('/', express.static(publicPath)); // we are using the express.static built-in middleware function to serve static files

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (! (isRealString(params.name) || isRealString(params.room))) {
            return callback('Name and room name are required.');
        }

        socket.join(params.room);

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat room.'));

        // adding .to(<room name>) will direct the message to the specific <room name>
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

        callback();
    });

    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        console.log('User created this message: ', message);
        callback('This is from te server, acknowledging that it received the createMessage event from the client.'); // this is how we can acknowledge

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // }); // broadcast will emit the event to every connected client except the client of the current socket.
    }); // this sets the server to listen to createMessage events created by the client

    socket.on("createLocationMessage", (coords, callback) => {
        let user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
            callback();
        }
    });
});

server.listen(port, () => {
    console.log('Listening on port ' + port);
});
