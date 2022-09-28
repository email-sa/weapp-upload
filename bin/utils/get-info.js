const path = require('path');
const fs = require('fs');

const getHelpInfo = show => {
    if (show) {
        let msg = '';
        msg += '\n  Usage';
        msg += '\n    $ npm run upload [options]\n';
        msg += '\n  Options';
        msg += '\n    -d, --dev                开发';
        msg += '\n    -p, --pro                正式';
        msg += '\n    -t, --test               测试';
        msg += '\n    -r, --robot              指定机器人 (default: 1)';
        msg += '\n    -h, --help               显示帮助信息\n';
        msg += '\n  Examples';
        msg += '\n    $ npm run upload --dev';
        msg += '\n    $ npm run upload --dev --robot 2';
        msg += '\n    $ npm run upload --help';
        return console.log(msg + '\n');
    }
};

module.exports = {
    getVersionInfo
};
