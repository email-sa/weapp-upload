const minimist = require('minimist');

const getParams = () => {
    const params = process.argv.slice(2); // 只保留命令参数

    const paramsDefault = {
        default: {
            dev: false, // 开发
            test: false, // 测试
            pro: false, // 正式
            robot: 1, // 机器人
            help: false // 获取提示
        },
        alias: {
            d: 'dev',
            t: 'test',
            p: 'pro',
            r: 'robot',
            h: 'help'
        }
    };
    let a = minimist(params, paramsDefault);
    console.log('params', a);
    return a;
};
module.exports = getParams;
