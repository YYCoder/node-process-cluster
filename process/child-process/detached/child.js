const http = require('http');

http.createServer((req, res) => {
    res.end('hahah');
}).listen(5000);

process.on('message', (d) => {
    process.send('子进程收到数据：' + d.toString());
});