#! /usr/bin/env node

// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的文件头
// 如果是Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改
const program = require("commander");
// const chalk = require("chalk"); // 优化文案样式
// const figlet = require("figlet"); // 绘制 Logo

// 定义命令和参数
program
    // 定义命令和参数
    .command("upload")
    .description("upload a mini project")
    .option("-s, --strict", "overwrite target directory if it exist")
    .action((name, options) => {
        // 在create 中执行创建任务
        require("../lib/create")(name, options);
    });

// // 监听--help,优化help de 展示
// program.on("--help", () => {
//     // 使用 figlet 绘制 Logo
//     console.log(
//         "\r\n" +
//             figlet.textSync("applet", {
//                 font: "Ghost",
//                 horizontalLayout: "default",
//                 verticalLayout: "default",
//                 width: 80,
//                 whitespaceBreak: true
//             })
//     );
//     // 说明信息
//     console.log(
//         `\r\nRun ${chalk.cyan(
//             `applet-taro <command> --help`
//         )} for detailed usage of given command\r\n`
//     );
// });

program
    // 配置版本号信息
    .version(`v${require("../package.json").version}`)
    .usage("<command> [option]");

// 解析用户执行命令传入参数
program.parse(process.argv);
