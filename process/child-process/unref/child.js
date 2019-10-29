const http = require('http');

http.createServer((req, res) => {
    res.end('hahah');
}).listen(5000);

