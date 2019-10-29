// 方式一：父子进程通过 IPC 方式通信
process.on('message', (data) => {
    process.send('子进程收到数据');
    // 若子进程没有继承父进程的 stdin、stdout、stderr，则该行没有任何输出
    process.stdout.write(data);
    // process.disconnect();
});

