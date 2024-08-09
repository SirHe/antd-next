import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"

export default {
  input: "./test.js", // 入口文件
  //   treeshake: false,
  output: [
    {
      file: "dist/bundle.cjs.js", // CommonJS 输出
      format: "cjs",
      sourcemap: true
    },
    {
      file: "dist/bundle.esm.js", // ES Module 输出
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    resolve(), // 解析 node_modules 中的模块
    commonjs(), // 转换 CommonJS 模块为 ES6
    typescript() // 支持 TypeScript
  ]
}
