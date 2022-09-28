const semver = require('semver');
const fs = require('fs');

function updateVersion(version) {
    // 先更新小版本
    let patchVersion = semver.inc(version, 'patch'); // 自增版本

    // 更新以后，进行parse
    let patchVersionObject = semver.parse(patchVersion);
    // 小版本满10. 就直接更新中版本
    if (patchVersionObject && patchVersionObject.patch >= 10) {
        // 更新中版本
        patchVersion = semver.inc(patchVersionObject, 'minor');
    }
    // 中版本满20，则进位
    if (patchVersionObject && patchVersionObject.minor >= 20) {
        patchVersion = semver.inc(patchVersionObject, 'major');
    }
    // strem.version = patchVersion;
    // // 写入文件
    // fs.writeFileSync('./package.json', JSON.stringify(strem, null, 2));
    return patchVersion;
}
module.exports = updateVersion;
