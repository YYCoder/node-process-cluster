const { Server: netServer } = require('net');
const { Server: httpServer } = require('http');

/* const workerServer = new netServer((s) => {
    // TODO: 为什么 通过 send 把 socket 传过来就不能正常处理响应了呢？
    s.write(`${process.pid} 响应请求`);
}); */

const workerServer = new httpServer((req, res) => {
    console.log('req！！！');
    res.end(`${process.pid} 响应请求`);
});

process.on('message', (data, serverOrSocket) => {
    const { act } = data;
    console.log(`${process.pid} 收到主进程消息 ${act}`);
    // console.log(serverOrSocket);
    
    if (act === 'listen') {
        serverOrSocket.on('connection', (socket) => {
            workerServer.emit('connection', socket);
        });
    }
    else if (act === 'connection') {
        workerServer.emit('connection', serverOrSocket);
    }
});

