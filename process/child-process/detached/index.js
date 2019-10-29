const { log, resolve } = require('../../../utils');
const { fork, spawn } = require('child_process');

// 获取占用指定端口的进程id命令：lsof -i:5000 | grep -o "[0-9]\{5\}"
/**
 * 创建子进程关键参数 *detached*
 *  * *默认情况下，父进程退出，子进程也会一并退出。当设置了该选项为 true 时，子进程会独立于父进程，即父进程退出子进程不会退出*
 * 
 *  * *孤儿进程*：亲测发现，*使用 `fork`、`spawn`，即使 detached 为 false，并且当父进程是被 `kill -[signal] pid` 的方式终止，子进程也仍然会存在，并且会升为`后台进程`*，*若父进程是 `cmd+c` 的方式终止，则行为正常，即子进程也会终止*。
 *  
 */
const cp = fork(resolve(__dirname, './child.js'), {
// const cp = spawn('node', [resolve(__dirname, './child.js')], {
    // detached: true,
    // stdio: 'ignore'
    // stdio: [0, 1, 2, 'ipc']
});

console.log('pid: ' + process.pid, 'cp pid: ', cp.pid);
process.stdin.on('data', (d) => {
    if (cp.connected) {
        cp.send(d.toString());
    }
});

cp.send('第一条消息');

cp.on('message', (d) => {
    log(d.toString());
});
