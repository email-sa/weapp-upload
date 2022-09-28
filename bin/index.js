const path = require("path");
const fs = require("fs");
const { readFileSync, writeFileSync } = fs;
const dotenv = require("dotenv"); // 读取.env文件
//
const process = require("process");
const cwd = process.cwd;
const cwdPath = cwd();

const {
    getUserDefaultDesc,
    execSync,
    getDesc
} = require("./utils/get-desc.js");
const updateVersion = require("./utils/get-version");

// 写入描述和key和版本号
const writeProjectConfig = (filePath, newConfig) => {
    const fileOption = { encoding: "utf-8" };
    const fileContent = readFileSync(filePath, fileOption);
    let config = JSON.parse(fileContent.toString());
    console.log("config", fileContent);
    Object.assign(config, newConfig);
    // const appid = {
    //     development: 'wx989cad3a4dc96fb9',
    //     testing: 'wxe25528aac2acd617',
    //     production: 'wx612e638e8053d5c5'
    // };
    // config.appid = appid[process.env.NODE_ENV || 'development'];
    let newStr = JSON.stringify(config, null, 2);
    writeFileSync(filePath, newStr, fileOption);
};

const readFile = (filePath) => {
    const fileOption = { encoding: "utf-8" };
    const fileContent = readFileSync(filePath, fileOption);
    let config = JSON.parse(fileContent.toString());
    return config;
};
// const getEnvInfo = () => {
//     // 读取env文件
//     let dotenvResult = dotenv.config({
//         path: ".env"
//     });
//     if (dotenvResult.error) {
//         throw new Error(dotenvResult.error);
//     }
//     const parsed = dotenvResult.parsed;
//     console.log("p", parsed);

//     return parsed;
// };
const loadWxconfig = async (configPath) => {
    try {
        // const res = readFileSync(path.join(cwdPath, "wx.config.js"));
        const res = await require(configPath);
        return res || {};
    } catch (e) {
        console.log("加载 config.js 失败", e);
        return {
            error: "未配置 config.js 文件"
        };
    }
};
// 获取版本号 wxe25528aac2acd617
const getVersion = async () => {
    const { version } = await loadWxconfig("./../wx.config.js");
    const { appid } = await readFile(path.join(cwdPath, "project.config.json")); // appid
    const defaultDesc = await getUserDefaultDesc(cwdPath); // 描述
    const newVersion = await updateVersion(version); // 版本号
    // console.log("版本更新成功", version);
    const { desc, robot } = await getDesc();
    // 写入appid和版本号;
    writeProjectConfig(path.join(cwdPath, "wx.config.js"), {
        appid,
        desc,
        version: newVersion,
        privateKeyPath: `./scripts/release/private.${appid}.key`
    });
};
getVersion();
// 获取描述
const getUploadDesc = () => {
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
};

// 发布小程序
