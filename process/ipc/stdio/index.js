
const { log } = require('../../../utils');
const { spawn } = require('child_process');
const { resolve } = require('path');

/**
 * 方式二：通过 stdio 通信
 *  * *options.stdio*：默认即为 'pipe'，同 ['pipe', 'pipe', 'pipe']，即在子进程上分别建立 stdin、stdout、stderr 管道，与
 * 父进程隔离。因此，可以通过 *cp.stdin、cp.stdout、cp.stderr* 与子进程通信，子进程通过 *process.stdin* 等与父进程通信
 * 
 *  * 相比 IPC，*弊端是只能传输 string 或 Buffer，不能像 IPC 那样传递 Socket*
 */
const cp = spawn('node', [resolve(__dirname, './child.js')]);
let flag = false;

cp.stdout.on('data', (chunk) => {
    log(chunk.toString());
    if (!flag) {
        flag = true;
        cp.stdin.write('没事，再见');
    }
});

cp.stdin.write('哈喽，儿子');
