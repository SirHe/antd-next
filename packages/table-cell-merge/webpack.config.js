import path from "path"
import { fileURLToPath } from "url"
import { merge } from "webpack-merge"

// 获取当前文件的目录名
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 基础配置
const baseConfig = {
  // 入口文件
  entry: "./test.js",

  // 解析配置
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"] // 默认解析的文件后缀名
  },

  // 模块规则
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false // 允许省略扩展名
        }
      }
    ]
  }
}

// CommonJS 配置
const commonJSConfig = {
  output: {
    filename: "bundle.cjs.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2" // CommonJS 规范
  }
}

// ES Module 配置
const esModuleConfig = {
  output: {
    filename: "bundle.esm.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "module", // ES Module 规范
    environment: {
      module: true
    }
  },
  experiments: {
    outputModule: true // 启用模块输出
  }
}

// 导出合并后的配置
export default [merge(baseConfig, commonJSConfig), merge(baseConfig, esModuleConfig)]
