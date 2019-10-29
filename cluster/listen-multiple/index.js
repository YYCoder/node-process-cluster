const { fork } = require('child_process');
const net = require('net');
const os = require('os');

const server = new net.Server;

let curIndex = 0;
const maxIndex = os.cpus().length - 1;
const workers = [];

server
    .on('listening', () => {
        console.log('listening 事件触发！');
        for (let i = 0; i <= maxIndex; i++) {
            const w = fork(__dirname + '/worker');
            workers.push(w);
            w.send(
                {
                    act: 'listen'
                },
                server
            );
        }
        server.close();
    })
    // TODO: 父进程监听 connection 事件，通过把 net.Socket 传过去让子进程响应
    /* .on('connection', (s) => {
        workers[curIndex].send(
            {
                act: 'connection'
            },
            s
        );
        
        if (curIndex < maxIndex)
            curIndex++;
        else 
            curIndex = 0;
    }); */

server.listen(5000);