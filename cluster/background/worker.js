const { worker } = require('cluster');
const http = require('http');

http.createServer((req, res) => {
    console.log(worker.process.pid + ' 响应请求');
    res.end('hello');
}).listen(5000, () => {
    console.log('process %s started', worker.process.pid);
});