const fs = require('fs');
const path = require('path');

process.stdin.resume();

setTimeout(() => {
    fs.readFile(path.resolve(__dirname, '../../utils.js'), (res) => {
        console.log(res);
    });
}, 10000);