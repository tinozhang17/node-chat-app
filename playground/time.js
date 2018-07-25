const moment = require('moment');

let date = moment(); // this creates a new moment object representing the current moment of time
date.add(1, 'Y').subtract(9, 'M');
console.log(date.format('MMM Do, YYYY'));

// 6:01 am or 12:30 pm
let someTimestamp = moment().valueOf();
console.log(someTimestamp);

let testDate = moment();
console.log(date.format('h:mm a'));