const { getRepoList, getTagList } = require("./http");
const ora = require("ora");
const inquirer = require("inquirer");
const utils = require("util");
const path = require("path");
const chalk = require("chalk");
const downloadGitRepo = require("download-git-repo"); // 不支持 Promise

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message);
    // 开始加载动画
    spinner.start();
    try {
        // 执行传入方法 fn
        const result = await fn(...args);
        // // 状态为修改为成功
        spinner.succeed();
        return result;
    } catch (error) {
        // 状态为修改为失败
        spinner.fail("Request failed, refetch ...", error);
    }
}

class Generator {
    constructor(name, targetDir) {
        // 目录名称
        this.name = name;
        // 创造位置
        this.targetDir = targetDir;
        this.downloadGitRepo = utils.promisify(downloadGitRepo);
    }

    // 获取用户选择的模板
    // 1）从远程拉取模板数据
    // 2）用户选择自己新下载的模板名称
    // 3）return 用户选择的名称

    async getRepo() {
        // 1）从远程拉取模板数据
        const repolist = await wrapLoading(
            getRepoList,
            "wating fetch template"
        );

        if (!repolist) return;

        // 过滤我们需要的模板,列表
        const repos = repolist
            .filter((item) => item.name.indexOf("applet") !== -1)
            .map((item) => item.name);
        // 2）用户选择自己新下载的模板名称

        const { repo } = await inquirer.prompt({
            name: "repo",
            type: "list",
            choices: repos,
            message: "Please choose a template to create project"
        });

        // 3）return 用户选择的名称

        return repo;
    }

    // 获取模板的版本号
    // 1）基于repo 从远程拉取版本信息
    // 2）用户选择自己新下载的版本tag
    // 3）return 用户选择的版本号

    async getVersion(repo) {
        // 1）基于repo 从远程拉取版本信息
        const versions = await wrapLoading(
            getTagList,
            "wating fetch version",
            repo
        );
        const tagsList = versions.map((item) => item.name);
        // 2）用户选择自己新下载的版本tag
        const { version } = await inquirer.prompt({
            name: "version",
            type: "list",
            choices: tagsList,
            message: "Please choose a version to create project"
        });
        // 3）return 用户选择的版本号
        return version;
    }

    // 下载远程模板
    // 1）拼接下载地址
    // 2）调用下载方法
    async download(repo, tag) {
        // 1）拼接下载地址
        let url = `email-sa/${repo}${tag ? "#" + tag : ""}`;
        // 2）调用下载方法
        await wrapLoading(
            this.downloadGitRepo, // 远程下载方法
            "waiting download template", // 加载提示信息
            url,
            path.resolve(process.cwd(), this.targetDir)
        );
    }

    // 创建逻辑,核心创建逻辑
    // 1）获取模板名称
    // 2）获取 tag 名称
    // 3）下载模板到模板目录
    async create() {
        const repo = await this.getRepo();
        let version = await this.getVersion(repo);

        // 3）下载模板到模板目录
        await this.download(repo, version);

        // 4）模板使用提示
        console.log(
            `\r\nSuccessfully created project ${chalk.cyan(this.name)}`
        );
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
        console.log("  npm install\r\n");
        console.log("  npm run dev\r\n");
    }
}

module.exports = Generator;
