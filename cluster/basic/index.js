const cluster = require('cluster');
const { resolve } = require('path');
const os = require('os');

/**
 * cluster 基本用法
 *  * 原理：
 *      * 依赖 `child_process.fork` 方法创建工作进程，因此可以使用 IPC 方式与主进程通信
 * 
 *      * *调度方法*：默认为循环法（即 `cluster.SCHED_RR`，或者叫 `round-robin`），抢占式为 `cluster.SCHED_NONE`，可以通过 `cluster.schedulingPolicy` 设置
 * 
 *  * API：
 *      * *isMaster*：判断当前进程是否为主进程，通常只需要在主进程和子进程代码在一起时用到
 * 
 *      * *setupMaster([settings])*：用于设置 fork 方法的默认配置，*唯一无法设置的是 fork 参数中的 `env` 属性*
 *          * *settings.inspectPort*：设置工作进程的调试端口。这可以是一个数字、或不带参数并返回数字的函数。*默认情况下，每个工作进程的端口都与主进程一样*，
 * 即主进程的 `process.debugPort`
 * 
 *      * *fork(filepath?)*：创建 Worker 进程
 * 
 *      * *worker*：当处在 Worker 进程中，通过该字段获取当前进程的相关信息，包括 `process`、`id` 等
 * 
 *      * *cluster.schedulingPolicy*：设置调度策略。*这是一个全局设置，当第一个工作进程被衍生或者调用 cluster.setupMaster() 时，都将第一时间生效*。
 */
// 修改调度策略
// 测试效果命令，`ab -n 10 -c 5 http://127.0.0.1:5000/`
// cluster.schedulingPolicy = cluster.SCHED_NONE;
cluster.setupMaster({
    exec: resolve(__dirname, './worker.js'),
});

for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
}
