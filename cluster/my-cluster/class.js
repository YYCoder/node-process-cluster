/**
 * 自己实现的 Cluster 模块
 * TODO: 学习 cluster 模块原理，实现自己的简易版本
 */
const EventEmitter = require('events');
const { Server } = require('http');
const { fork } = require('child_process');
const net = require('net');

class Master extends EventEmitter {
    isMaster = true

    isWorker = false
    
    uniqueId = 0
    
    workers = new Map

    server = null
    
    constructor() {}
    
    fork = (filePath, opts = {}) => {
        const workerProcess = fork(filePath, {
            ...opts,
            env: {
                ...process.env,
                ...opts.env,
                MY_UNIQ_ID: ++this.uniqueId
            }
        });
        const pid = workerProcess.pid;
        // 由于 fork 自带 IPC 通信管道，所以可以直接用 message 事件监听
        workerProcess.on('internalMessage', IPCMessageHandle);
        workerProcess.once('exit', () => {
            console.log(`worker ${pid} exited`);
            this.removeWorker(pid);
            this.emit('exit');
        });
        // 新建一个 Worker 实例，并把进程对象挂载上去
        const worker = new Worker({
            process: workerProcess
        });
        this.workers.set(pid, worker);
    }

    IPCMessageHandle = (data = {}) => {
        console.log('IPC Message: ', data);
        const { act, port, cb } = data;
        // TODO: 当 worker 中 listen 时，获取 Server 所需参数，并在主进程中初始化 Server
        if (act === 'newServer') {
            const server = net.createServer((socket) => {
                socket.on('connect', () => {

                });
            });
            server.listen(port);
        }
    }

    removeWorker = (pid) => {
        const worker = this.workers.get(pid);
        assert(!worker, `未找到 Worker ${pid}`);
        this.workers.delete(pid);
        worker.removeAllListeners('message');
    }
}

class Worker extends EventEmitter {
    isMaster = false

    isWorker = true
    
    process = null
    
    constructor({ process }) {
        this.process = process;
        console.log('初始化 Worker', process);
    }

    send = (msg) => {
        process.send(msg);
    }
}

class MyHttpServer extends Server {
    listen(port, cb = (req, res) => {}) {
        const { isWorker } = require(__filename);
        if (isWorker) {
            process.emit('internalMessage', {
                act: 'newServer',
                port,
                cb
            });
        }
        else {
            Server.listen.call(this, port);
        }
    }
}

module.exports.http = MyHttpServer;
module.exports.cluster = 'MY_UNIQ_ID' in process.env ? new Master : new Worker;