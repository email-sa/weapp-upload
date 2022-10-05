// fs-extra 是对 fs 模块的扩展，支持 promise
// const fs = require("fs-extra");
// const path = require("path");
// const inquirer = require("inquirer");
const { parseEnvFile } = require("./file");
const Generator = require("./Generator");

const uplosd = async function (type, option, typeInfo) {
    console.log("\r\nUploading");
    // const targetPath = process.cwd;
    // 开始上传
    const generator = new Generator(type, typeInfo);
    // 开始创建项目
    generator.upload();
};
// module.exports = Upload
const typeInfo = parseEnvFile();
if (typeInfo) {
    console.log("typeInfo", typeInfo);
    uplosd("test", {}, typeInfo);
}
