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
    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
}); // we set the client to listen to a newMessage event emitted from the server

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit("createMessage", {
        from: "User",
        text: jQuery('[name=message]').val()
    }, function (acknowledgement) {
        console.log(acknowledgement);
    });
});