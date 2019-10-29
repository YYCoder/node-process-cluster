const { spawn } = require('child_process');
const fs = require('fs');
const { resolve } = require('../../utils');

/**
 * *cluster 实现进程后台运行，并可以通过命令 kill 掉*
 *  * 原理：
 *      * 后台运行：*通过一个命令创建子进程的方式启动主进程，并 `unref`，让主进程提升为后台进程*
 *
 *      * kill：*创建主进程时，通过 pid 文件记录主进程 pid，之后读取该文件即可 kill*
 * 
 *  * *为什么要让进程后台运行？*
 *      * 因为默认在 shell 中启动进程的话，*当你退出 shell 系统会自动 kill 所有 shell 衍生的子进程（包括你启动的 node 进程）*，而后台运行后
 * 进程的 *ppid 是 1*，即 *init 进程*，就不会因为退出 shell 而被 kill 掉。*pm2 的守护进程就是后台运行的，`ppid === 1`*
 * 
 *      * 同时，*非后台运行的进程也可能因为空闲时间太长而被系统自动关闭*
 */
const pidFile = __dirname + '/pid';
// 若进程子命令是 stop，则 kill
if (process.argv[2] === 'stop') {
    const pid = fs.readFileSync(pidFile, 'utf8');

    if (!process.kill(pid, 0)) {
        console.log(`进程 ${pid} 不存在！`);
        return;
    }
    
    process.kill(Number(pid));
    fs.unlinkSync(pidFile);
}
else {
    const cp = spawn('node', [resolve(__dirname, './main.js')], {
        stdio: 'ignore'
    });
    // 记录主进程 pid
    fs.writeFileSync(pidFile, cp.pid);
    // 删除当前进程的引用计数，取消该进程与它子进程的关联
    cp.unref();
}
