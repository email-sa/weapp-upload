// fs-extra 是对 fs 模块的扩展，支持 promise
const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");
const Generator = require("./Generator");

module.exports = async function (name, option) {
    // 执行创建命令

    // 当前命令选择的目录
    const cwdPath = process.cwd();
    // 需要创建的目录地址
    const targetPath = path.join(cwdPath, name);
    // 目录是否存在
    if (fs.existsSync(targetPath)) {
        // 存在,是否强制创建
        if (option.force) {
            // 强制创建,先移除
            await fs.remove(targetPath);
        } else {
            // 不强制创建,询问用户是否要覆盖
            let { action } = await inquirer.prompt([
                {
                    name: "action",
                    type: "list",
                    message: "Target directory already exists Pick an action:",
                    choices: [
                        { name: "Overwrite", value: "overwrite" },
                        { name: "Cancel", value: false }
                    ]
                }
            ]);
            if (action) {
                // 移除已经存在的目录
                console.log("\r\nRemoving");
                await fs.remove(targetPath);
            } else {
                return;
            }
        }
    }
    // 不存在 直接创建
    // 创建目录
    const generator = new Generator(name, targetPath);
    // 开始创建项目
    generator.create();
};
