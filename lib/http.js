// 处理模板和版本的信息获取
const axios = require("axios");

axios.interceptors.response.use((res) => {
    return res.data;
});

/**
 * 发布体验版到草稿箱
 * @returns Promise
 */
async function pushNewVersion(url, type = "post") {
    return axios[type](url);
}

module.exports = {
    pushNewVersion
};
