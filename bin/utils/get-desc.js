const { execSync } = require("child_process");
const inquirer = require("inquirer");

const getUserDefaultDesc = (projectPath) => {
    // 获取最新 git 记录 7位的 commit hash
    let gitCommitHash = "git commit hash 为空";
    try {
        gitCommitHash = execSync("git rev-parse --short HEAD", {
            cwd: projectPath
        })
            .toString()
            .trim();
    } catch (e) {
        console.warn("获取 git commit hash 失败");
        console.warn(e);
    }

    // 获取项目的git仓库的 user.name
    let userName = "默认";
    try {
        userName = execSync("git config user.name", {
            cwd: projectPath
        })
            .toString()
            .trim();
    } catch (e) {
        console.warn("git config user.name 获取失败");
        console.warn(e);
    }

    const desc = `${gitCommitHash} - by@${userName}`;
    return desc;
};

const getDesc = async () => {
    const promptList = [
        {
            type: "input",
            message: "请输入机器人编号：",
            name: "desc",
            validate: function (val) {
                const reg = new RegExp(/^[1-9]{1,3}$/g);
                if (reg.test(val)) {
                    return true;
                }
                return "请输入1-999的编号";
            }
        },
        {
            type: "input",
            message: "请输入发版备注：",
            name: "robot",
            validate: function (val) {
                if (val) {
                    return true;
                }
                return "请输入发版备注";
            }
        }
    ];
    let config = await inquirer.prompt(promptList);
    return config;
};
module.exports = { getDesc, execSync, getUserDefaultDesc };
