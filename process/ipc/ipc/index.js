const { log } = require('../../../utils');
const { spawn } = require('child_process');
const { resolve } = require('path');

/**
 * 方式一：通过 Node 子进程原生的 ipc 功能通信
 *  * *options.stdio*：数组中需要添加 'ipc' 值，表示给父子进程简历 *IPC 通道*
 *      * stdio 输入数组时，*[0, 1, 2] 按位置，分别表示继承父进程的 stdin、stdout、stderr*
 *          * 即表示 ['inherit', 'inherit', 'inherit']，或值为字符串 'inherit'
 *      
 *      * stdio 输入数组时，*[0, 1, 2] 也可以用文件来替换，即把输入、输出重定向到指定文件中，常用于日志打印*
 *  
 *  * IPC 通道建立后才可使用 *cp.send*、*cp.on('message')* 方法，否则会报错
 */
const cp = spawn('node', [resolve(__dirname, './child.js')], {
    // 继承父进程的 stdin、stdout、stderr，同时建立 IPC 通道
    stdio: [0, 1, 2, 'ipc'],
    // 此时没有继承父进程的 stdin、stdout、stderr，在子进程中 console.log、或者 process.stdout.write 是没有任何输出的
    // stdio: ['ipc'],
    // 忽略子进程的所有 0、1、2
    // stdio: 'ignore',
    // 等于 [0, 1, 2] 或 ['inherit', 'inherit', 'inherit']
    // stdio: 'inherit'
});

// 将输入发送给子进程
process.stdin.on('data', (d) => {
    if (cp.connected) {
        cp.send(d.toString());
    }
});

cp.on('message', (data) => {
    log('父进程收到数据');
    log(data.toString());
});

cp.on('disconnect', () => {
    log('好的，再见儿子');
});
