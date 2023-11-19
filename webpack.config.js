const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: {
        index: "./bin/cli.js"
        // "index.min": "./bin/cli.js"
    },
    output: {
        filename: "[name].js",
        library: "miniCli",
        libraryExport: "default"
    },
    externals: {
        fs: require("fs"),
        child_process: require("child_process")
    },
    mode: "none",
    module: {
        noParse: /node_modules/
    },
    plugins: [new NodePolyfillPlugin()],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                // include: /\.min\.js$/,
                terserOptions: {
                    compress: {
                        warnings: false, // 删除无用代码时是否给出警告
                        drop_console: true, // 删除所有的console.*
                        drop_debugger: true // 删除所有的debugger
                        // pure_funcs: ['console.log'], // 删除所有的console.log
                    }
                }
            })
        ]
    }
};
