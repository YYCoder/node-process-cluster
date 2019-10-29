const path = require('path');

module.exports.log = (...args) => console.log(...args);
module.exports.resolve = (...args) => path.resolve(...args);