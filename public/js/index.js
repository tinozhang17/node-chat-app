let socket = io(); // this will open up a websocket and keep that connection opened. This variable is critical to communicating.

socket.on('connect', function () {
    console.log('Connected to server');

    // socket.emit('createMessage', {
    //     from: 'User',
    //     text: 'A new message from user'
    // }); // We are emitting a createMessage event from the client to the server
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log('New message from server', message);
}); // we set the client to listen to a newMessage event emitted from the server