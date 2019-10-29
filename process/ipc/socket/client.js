const { log } = require('../../../utils');
const net = require('net');
const { sockPath } = require('./index');

const socket = net.createConnection(sockPath, () => {
    log('成功连接上 socket !');
});
socket.on('data', (data) => {
    log(`收到IPC Server回复，${data.toString()}`);
});
process.stdin.on('data', (chunk) => {
    socket.write(chunk.toString());
});
