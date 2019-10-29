const {
    isMainThread, parentPort, workerData, threadId,
    MessageChannel, MessagePort, Worker
} = require('worker_threads');

/**
 * 通过 MassageChannel 让两个子线程直接通信
 */
if (isMainThread) {
    const worker1 = new Worker(__filename);
    const worker2 = new Worker(__filename);
    const {
        port1,
        port2
    } = new MessageChannel();
    worker1.postMessage({ hereIsYourPort: port1 }, [port1]);
    worker2.postMessage({ hereIsYourPort: port2 }, [port2]);
} else {
    parentPort.once('message', (value) => {
        value.hereIsYourPort.postMessage('hello');
        value.hereIsYourPort.on('message', msg => {
            console.log(`thread ${threadId}: receive ${msg}`);
            // 若打开这句，则会无限循环发送消息
            // value.hereIsYourPort.postMessage('hello');
            process.exit();
        });
    });
}

