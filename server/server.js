const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public'); // this will bring us to the public folder nicely
const port = process.env.PORT || 3000;

let app = express();

app.use('/', express.static(publicPath)); // we are using the express.static built-in middleware function to serve static files

app.listen(port, () => {
    console.log('Listening on port ' + port);
});
