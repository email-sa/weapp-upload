// const { parseEnvFile } = require("./file");
const Generator = require("./Generator");

module.exports = async function (type, typeInfo) {
    console.log("\r\nUploading");
    // 开始上传
    const generator = new Generator(type, typeInfo);
    // 开始创建项目
    generator.start();
};
