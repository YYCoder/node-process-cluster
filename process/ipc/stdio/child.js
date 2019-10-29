let flag = false;

/**
 * console.log 实质上就是 process.stdout.write 的语法糖，并且加上自动换行
 */
process.stdin.on('data', async (chunk) => {
    /* console.log(chunk.toString());
    if (!flag) {
        console.log('在，干嘛');
        flag = true;
    } */
    process.stdout.write(chunk);
    if (!flag) {
        process.stdout.write('在，干嘛' + '\n');
        flag = true;
    }
    setTimeout(() => {
        process.disconnect();
    }, 1000);
});
