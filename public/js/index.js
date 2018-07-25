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

socket.on('newLocationMessage', function (message) {
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    let messageTextBox = jQuery('[name=message]');
    socket.emit("createMessage", {
        from: "User",
        text: messageTextBox.val()
    }, function (acknowledgement) {
        messageTextBox.val('');
        console.log(acknowledgement);
    });
});

let locationButton = jQuery('#send-location');
locationButton.on("click", (e) => {
    if (! navigator.geolocation) {
        return alert("Geolocation not supported by your browser");
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function () {
            locationButton.removeAttr('disabled').text('Send location');
        });
    }, function (err) {
        locationButton.removeAttr('disabled').text('Send location');
        return alert("Unable to share location");
    });
});