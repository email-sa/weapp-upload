# 搭建自己的脚手架

参考
https://juejin.cn/post/6966119324478079007#heading-21


# 使用
`javascript 
npm i weapp-cli


`
配置的目录结构
- scripts
-- upload
--- wx.config.js
--- .env

## 脚手架的功能

1. 通过 applet-taro-cli create <name> 命令启动项目
2. 询问用户下载什么模板
3. 拉取远端模板

## 具体步骤拆解

1. 创建项目
2. 创建脚手架启动命令（使用 commander）
3. 询问用户问题获取创建所需信息（使用 inquirer）
4. 下载远程模板（使用 download-git-repo）
5. 发布项目
