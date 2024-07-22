import typescript from "rollup-plugin-typescript2"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import json from "@rollup/plugin-json"
import babel from "@rollup/plugin-babel"

const extensions = [".ts", ".tsx", ".js", ".jsx", ".json"]

export default [
  // CommonJS
  {
    input: "src/index.ts",
    output: { file: "dist/index.cjs", format: "cjs" },
    plugins: [
      resolve({ extensions }),
      typescript({
        useTsconfigDeclarationDir: true
      }),
      commonjs(),
      json(),
      babel({ babelHelpers: "bundled" })
    ]
  },
  // ES Module
  {
    input: "src/index.ts",
    output: { file: "dist/index.mjs", format: "es" },
    plugins: [
      resolve({ extensions }),
      typescript({
        useTsconfigDeclarationDir: true
      }),
      json(),
      babel({ babelHelpers: "bundled" })
    ]
  },
  // Browser
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "iife",
      name: "Shared",
      globals: { react: "React" }
    },
    plugins: [
      resolve({ extensions }),
      typescript({
        useTsconfigDeclarationDir: true
      }),
      json(),
      babel({ babelHelpers: "bundled" })
    ]
  }
] as any
