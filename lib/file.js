const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const cwdPath = process.cwd(); // 当前命令选择的目录
const { readFileSync, writeFileSync } = fs;

const uploadEnvPath = "./scripts/upload";
const defaultIgnore = [
    "/node_modules/**/*",
    "/CHANGELOG.md",
    "/README.md",
    "/yarn.lock",
    "/package-lock.json"
];

const formatFileConfig = (options) => {
    let {
        privateKeyPath,
        projectPath,
        // defaultConfigPath,
        // packageJsonPath,
        ignores
    } = options;
    privateKeyPath = path.resolve(cwdPath, privateKeyPath || "");
    projectPath = path.resolve(cwdPath, projectPath || "");
    // defaultConfigPath = path.resolve(cwdPath, defaultConfigPath || "");
    // packageJsonPath = path.resolve(cwdPath, packageJsonPath || "");
    ignores = ignores.map((item) => `${projectPath}${item}`);

    return {
        ignores,
        // ...options,
        // defaultConfigPath,
        privateKeyPath,
        projectPath
        // packageJsonPath
    };
};
// 解析 .env文件
const parseEnvFile = (envPath = uploadEnvPath) => {
    let parsed = {};
    let dotenvResult = dotenv.config({
        path: path.resolve(cwdPath, envPath + "/.env")
    });
    parsed = dotenvResult.parsed;
    if (dotenvResult.error) {
        throw dotenvResult.error;
    }
    console.log("parsed", parsed);

    // let config = formatConfig(parsed);

    return {
        ...parsed,
        defaultConfigPath: path.resolve(cwdPath, parsed.defaultConfigPath || "")
    };
};
// 解析json文件
const loadJsonConfig = async (jsonPath, type = "wx.config.json") => {
    try {
        const res = await require(jsonPath);
        console.log("res", res);
        return res || {};
    } catch (e) {
        console.log(`加载 ${type} 失败`, e);
        return {
            error: `未配置 ${type} 文件`
        };
    }
};
// 写入描述和key和版本号
const writeProjectConfig = (filePath, newConfig) => {
    const fileOption = { encoding: "utf-8" };
    const fileContent = readFileSync(filePath, fileOption);
    let config = JSON.parse(fileContent.toString());
    // let config_1 = JSON.parse(config);
    console.log("config", newConfig);
    Object.assign(config, newConfig);
    // const appid = {
    //     development: 'wx989cad3a4dc96fb9',
    //     testing: 'wxe25528aac2acd617',
    //     production: 'wx612e638e8053d5c5'
    // };
    // config.appid = appid[process.env.NODE_ENV || 'development'];
    let newStr = JSON.stringify(config, null, 4);
    writeFileSync(filePath, newStr, fileOption);
    // writeFileSync(filePath, JSON.stringify(newConfig, null, 2));
};
module.exports = {
    loadJsonConfig,
    parseEnvFile,
    uploadEnvPath,
    writeProjectConfig,
    formatFileConfig,
    defaultIgnore
};
