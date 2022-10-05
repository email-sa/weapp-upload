const { pushNewVersion } = require("./http");
const ora = require("ora");
// const inquirer = require("inquirer");
const fileUtil = require("./file");
const util = require("./utils");
const path = require("path");
const inquirer = require("inquirer");
// const chalk = require("chalk");
// const downloadGitRepo = require("download-git-repo"); // 不支持 Promise
// const cwdPath = process.cwd();
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
    constructor(type, envInfo) {
        // 目录名称
        this.type = type;
        // 创造位置
        this.defaultConfigPath =
            envInfo.defaultConfigPath || "./project.config.json"; // 微信的配置文件地址
        this.uploadEnvPath = fileUtil.uploadEnvPath; // 发布命令的配置地址
        this.robot = 1; // 发布的机器人
        this.envInfo = envInfo;
    }
    cwdPath = process.cwd();
    // 获取用户输入的机器人和备注
    // 1）输机器人序号
    // 2）输入备注
    // 3）return 用户输入的内容
    async getUserPrompt() {
        const promptList = [
            {
                type: "input",
                message: "请输入机器人编号：",
                name: "desc",
                default: 1,
                validate: function (val) {
                    const reg = new RegExp(/^[1-9]{1,3}$/g);
                    if (reg.test(val.trim())) {
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
    }
    // 初始化参数 优先使用 wx.config.json中的配置
    // 核心上传逻辑
    // 1）获取 自定义的上传参数
    // 2）获取机器人序号
    // 3）获取 版本描述
    // 4）获取版本号
    async initParams() {
        let wxConfigPath = path.join(
            this.cwdPath,
            this.uploadEnvPath + "/wx.config.json"
        );
        const config = await fileUtil.loadJsonConfig(wxConfigPath);
        if (config.error) {
            return;
        } else {
            const { version, setting, projectPath } = config ?? {};
            // 读取小程序配置文件中的appid
            const { appid } = await fileUtil.loadJsonConfig(
                this.defaultConfigPath,
                "config.json"
            ); // appid
            const versions = await wrapLoading(
                util.getUserDefaultDesc(this.cwdPath),
                "wating fetch version"
                // repo
            );
            // const defaultDesc = await util.getUserDefaultDesc(this.cwdPath); // 生成commitId描述
            //用户输入的内容
            const { desc, robot } = await this.getUserPrompt();
            const newVersion = await util.updateVersion(version); // 版本号
            const newWxConfig = {
                ...config,
                appid,
                desc,
                version: newVersion.trim(),
                privateKeyPath: `${this.uploadEnvPath}/private.${appid}.key`
            };
            // 写入appid和版本号;
            // fileUtil.writeProjectConfig(wxConfig, newWxConfig);
            console.log("wxConfig", this.envInfo, config);

            return newWxConfig;
        }
    }
    async parseInitParams() {
        const wxConfig = await this.initParams();
        const {
            appid,
            desc,
            version,
            privateKeyPath,
            type,
            ignores,
            setting,
            onProgressUpdate
        } = wxConfig;
        const { projectPath } = this.envInfo || {};
        console.log("privateKeyPath", privateKeyPath);

        // 上传忽略的文件
        let ignoreList = ignores;
        if (!ignoreList) {
            ignoreList = fileUtil.defaultIgnore;
        }
        const formatConfig = await fileUtil.formatFileConfig({
            projectPath,
            ignores: ignoreList,
            privateKeyPath
        });
        const projectInfo = {
            appid,
            type: type || "miniProgram",
            ...formatConfig
        };
        const uploadInfo = {
            version,
            desc,
            setting: setting || {
                es6: true
            },
            onProgressUpdate: onProgressUpdate || console.log
        };
        return { projectInfo, uploadInfo };
    }

    // // 使用接口像远程发布小程序 适用于第三方小程序
    // 1）拼接下载地址
    // 2）调用下载方法
    async download(repo, tag) {
        // 1）拼接下载地址
        let url = `email-sa/${repo}${tag ? "#" + tag : ""}`;
        // 2）调用下载方法
        await wrapLoading(
            pushNewVersion, // 远程下载方法
            "waiting push project", // 加载提示信息
            url,
            path.resolve(process.cwd(), this.targetDir)
        );
    }

    // 5）上传项目
    async upload() {
        // 初始化部署的参数
        const { projectInfo, uploadInfo } = await this.parseInitParams();
        // 开始上传
        const ci = require("miniprogram-ci");
        console.log("projectInfo", projectInfo, uploadInfo);

        try {
            // 注意： new ci.Project 调用时，请确保项目代码已经是完整的，避免编译过程出现找不到文件的报错。
            const project = new ci.Project(projectInfo);
            if (project) {
                const uploadResult = await ci.upload({
                    ...uploadInfo,
                    project
                });

                console.log(uploadResult);
            }
        } catch (error) {
            console.warn("部署失败");
            console.warn(error);
        }

        // const repo = await this.getRepo();
        // let version = await this.getVersion(repo);
        // // 3）下载模板到模板目录
        // await this.download(repo, version);
        // // 4）模板使用提示
        // console.log(
        //     `\r\nSuccessfully created project ${chalk.cyan(this.name)}`
        // );
        // console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
        // console.log("  npm install\r\n");
        // console.log("  npm run dev\r\n");
    }
}

module.exports = Generator;
