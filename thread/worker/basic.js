const {
    isMainThread, parentPort, workerData, threadId,
    MessageChannel, MessagePort, Worker
} = require('worker_threads');

/**
 * 最简单的 Worker 用例：计数达到 5 Worker 自动退出。API 简介如下：
 *  * *Worker(filename[, options])*：新建一个 Worker 线程
 *      * *options.workerData*：给 Worker 线程传递的参数，可以是任何 JS 数据类型。在内部会被 clone 再传递
 * 
 *      * *options.stdin/stdout/stderr*：默认为 false。若值为 true，则 Worker 线程的 stdin/stderr/stdout 不会自动继承
 * 父进程，会有独立的 process.stdin/stderr/stdout
 * 
 *      * *options.env*：环境变量，可以通过 `process.env` 获取
 *  
 *  * *isMainThread*：在主线程中为 true，Worker 中为 false
 * 
 *  * *parentPort*：Worker 线程中获取主线程的句柄，用于和主线程通信
 * 
 *  * *workerData*：Worker 线程中获取主线程初始化时传入的参数
 * 
 *  * *threadId*：线程 ID
 * 
 *  * *通信*：
 *      * 主线程、Worker 线程都通过 *postMessage(value[, transferList])* 向对方发送消息，并通过 *on('message')* 监听
 * 
 *      * *postMessage(value[, transferList])*：参数同 workerData，可以是任意 JS 数据类型。在内部会被 clone 再传递
 *          * transferList 不同于 child_process，不能传递 Socket
 * 
 *      * *如上方法都是 MessagePort 实例的方法，新建 Worker 的时候也是默认已为主线程及 Worker 线程建立了 MessagePort 通道*
 * 
 *  * *Worker 方法*：
 *      * *terminate()*：主线程中通过 `worker.terminate()` 终止 Worker 线程，Worker 线程中通过 `process.exit` 终止
 */
function mainThread() {
    new Array(4).fill('').forEach(() => {
        const worker = new Worker(__filename, { workerData: 0 });
        worker.on('exit', code => {
            console.log(`main: worker stopped with exit code ${code}`);
        });
        worker.on('message', msg => {
            console.log(`main: receive ${msg}`);
            worker.postMessage(msg + 1);
            worker.terminate();
        });
    })
}

function workerThread() {
    /* Worker 的 stdin、stdout、stderr 继承父进程 */
    console.log(`worker: threadId ${threadId} start with ${__filename}`);
    console.log(`worker: workerData ${workerData}`);
    parentPort.on('message', msg => {
        console.log(`worker: receive ${msg}`);
        if (msg === 5) {
            // Worker 线程中通过 process.exit 退出，这个方法有点迷幻。。。感觉像进程退出，但实际是 Worker 线程退出
            // process.exit();
        }
        parentPort.postMessage(msg);
    });
    parentPort.postMessage(workerData);
}

if (isMainThread) {
    mainThread();
} else {
    workerThread();
}





