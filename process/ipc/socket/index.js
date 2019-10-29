/**
 * 方式三：通过本地 socket 通信
 *  * Node 通过 `net` 模块创建 TCP 及 IPC 服务器，创建 IPC 服务器时可以通过 `server.listen(path)` 的方式
 * 创建一个指定 path 的 socket，从而通过 socket 实现跨进程通信
 * 
 *  * TODO: 这里还有一些不理解的地方，问题如下：
 *      1. 为什么 IPC server 启动后，client 连接这个 socket 文件会报 EADDRINUSE 错误？
 * 
 *      2. 接问题 1，为什么 `server.close` 后再 `listen` 就能成功？
 * 
 *      3. 接问题 2，为什么重试后启动的 server 中的 console.log 都会打印到 client 的输出流中？
 */
const net = require('net');
const fs = require('fs');
const path = require('path');
const { log } = require('../../../utils');
const socketPath = path.resolve(__dirname, './test-1.sock');

module.exports.sockPath = socketPath;

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        log(`收到消息, ${data.toString()}`);
        socket.write(`回复你, ${data.toString()}`);
    });
    socket.on('end', () => {
        log('socket 已断开');
        // socket.close();
        // fs.unlinkSync(socketPath);
    });
});

server
    .listen(socketPath, () => {
        log('IPC 服务已启动');
    })
    .on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            log('地址正被使用，重试中...');
            setTimeout(() => {
                server.close();
                server.listen(socketPath, () => {
                    log('服务已重启');
                });
            }, 1000);
        }
    })
    .on('close', () => {
        log('IPC Server 已关闭');
        fs.unlinkSync(socketPath);
    });
