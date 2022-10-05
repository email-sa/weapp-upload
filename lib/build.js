// fs-extra 是对 fs 模块的扩展，支持 promise
const fs = require("fs-extra");
// const path = require("path");
const inquirer = require("inquirer");
const Generator = require("./Generator");

module.exports = async function (type, options, typeInfo) {
    try {
        console.log("\r\nBuilding");
        gitCommitHash = execSync(`npm run ${typeInfo[type || develop]}}`, {
            cwd: cwdPath
        });
    } catch (e) {
        console.warn("构建 失败");
        console.warn(e);
    }
};
