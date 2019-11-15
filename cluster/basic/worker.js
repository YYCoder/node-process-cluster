const { worker } = require('cluster');
const http = require('http');

const server = http.createServer((req, res) => {
    console.log(worker.process.pid + ' 响应请求');
    res.end('hello');
}).listen(5000, '127.0.0.1', () => {
    console.log('process %s started', worker.process.pid);
    // console.log(server.address().port);
});