let socket = io('/index');

socket.on('connect', function () {
    socket.emit('getRoomList', undefined, function (err) {
        if (err) {
            window.alert(err);
        } else {
            console.log('no error');
        }
});
});

socket.on('updateRoomList', function (rooms) {
    let template = jQuery('#room-list-template').html();
    let html = Mustache.render(template, {rooms: rooms});
    jQuery('#form-field__room-list').html(html);
});