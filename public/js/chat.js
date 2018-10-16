let socket = io('/chat'); // this will open up a websocket and keep that connection opened. This variable is critical to
// communicating.

function scrollToBottom () {
    // Selectors
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');
    // Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    let params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            window.alert(err);
            window.location.href = '/'
        } else {
            console.log('No error');
        }
    });

    // socket.emit('createMessage', {
    //     from: 'User',
    //     text: 'A new message from user'
    // }); // We are emitting a createMessage event from the client to the server
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    let formattedTime = moment(message.createAt).format('h:mm a');
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // let formattedTime = moment(message.createAt).format('h:mm a');
    // console.log('New message from server', message);
    // let li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    //
    // jQuery('#messages').append(li);
}); // we set the client to listen to a newMessage event emitted from the server

socket.on('newLocationMessage', function (message) {
    let formattedTime = moment(message.createAt).format('h:mm a');
    let template = jQuery('#location-message-template').html();
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    // let li = jQuery('<li></li>');
    // let a = jQuery('<a target="_blank">My current location</a>');
    //
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('updateUserList', function (users) {
    let template = jQuery('#user-list-template').html();
    let html = Mustache.render(template, {users: users});
    jQuery('#users').html(html);
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    let messageTextBox = jQuery('[name=message]');
    socket.emit("createMessage", {
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