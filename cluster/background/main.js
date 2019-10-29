const cluster = require('cluster');
const { resolve } = require('path');
const os = require('os');

cluster.setupMaster({
    exec: resolve(__dirname, './worker.js')
});
cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
    const newWorker = cluster.fork();
    console.log(`已重启工作进程，pid：${newWorker.process.pid}`);
});
for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
}
