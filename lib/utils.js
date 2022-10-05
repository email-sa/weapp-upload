const { execSync } = require("child_process");
const semver = require("semver");

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
// 更新版本号
function updateVersion(version) {
    // 先更新小版本
    let patchVersion = semver.inc(version, "patch"); // 自增版本

    // 更新以后，进行parse
    let patchVersionObject = semver.parse(patchVersion);
    // 小版本满10. 就直接更新中版本
    if (patchVersionObject && patchVersionObject.patch >= 10) {
        // 更新中版本
        patchVersion = semver.inc(patchVersionObject, "minor");
    }
    // 中版本满20，则进位
    if (patchVersionObject && patchVersionObject.minor >= 20) {
        patchVersion = semver.inc(patchVersionObject, "major");
    }
    // strem.version = patchVersion;
    // // 写入文件
    // fs.writeFileSync('./package.json', JSON.stringify(strem, null, 2));
    return patchVersion;
}

module.exports = {
    getUserDefaultDesc,
    updateVersion
};
