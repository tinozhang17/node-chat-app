let generateMessage = (from, text) => {
    return {from, text, createdAt: new Date().getTime()};
};

let generateLocationMessage = (from, latitute, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitute},${longitude}`,
        createdAt: new Date().getTime()
    };
};

module.exports = {generateMessage, generateLocationMessage};