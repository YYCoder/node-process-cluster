const { log, resolve } = require('../../../utils');
const fs = require('fs');
const { fork, spawn } = require('child_process');

/**
 * *ChildProcess 关键方法 unref*：实现子进程退出，主进程也会继续运行
 *  * *默认情况下，当子进程都退出后，主进程会自动终止*，但调用了 `ChildProcess.unref` 后，主进程的事件循环不会在其引用计数中包括子进程
 * 允许父进程独立于子进程退出
 * 
 *  * *注意事项*：
 *      1. *若子进程与主进程还有管道相连，如 stdio 默认的 'pipe' 或 'inherit'，则子进程退出主进程还是会一并退出*
 *
 *      2. 由 1，必须给子进程的 *stdio 设置为 'ignore'* 或将其 *stdin、stdout、stderr 都重定向*到与主进程无关联的
 * 地方（如文件），才能实现子进程退出，主进程不会退出
 * 
 *      3. *若启用了 unref，则默认主进程会在执行完成后直接退出，但子进程不会退出*，要想让主进程不字段退出，可以用如下方法 hack
 * 
 *      4. 亲测，*用 fork 实现不了 unref*
 */
const out = fs.openSync(resolve(__dirname, './out.log'), 'a');
const err = fs.openSync(resolve(__dirname, './err.log'), 'a');
// const cp = fork(resolve(__dirname, './child.js'), {
const cp = spawn('node', [resolve(__dirname, './child.js')], {
    // stdio: [0, 1, 2, 'ipc'],
    stdio: 'ignore',
    // stdio: ['ignore', out, err]
});

// 若启用了 unref，则默认主进程会直接退出，但子进程不会退出，要想让主进程不字段退出，可以用如下方法 hack
// process.stdin.resume();
cp.unref();

