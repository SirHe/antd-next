import { resolve } from "path"
import react from "@vitejs/plugin-react"
import vue from "@vitejs/plugin-vue"
import { defineConfig, loadEnv } from "vite"

type Recordable<T = any> = Record<string, T>

interface EnvConfig {
  VITE_PORT?: number
  VITE_OPEN?: boolean
}

export function wrapperEnv(envConfig: Recordable): EnvConfig {
  const ret: any = {}
  for (let [key, value] of Object.entries(envConfig)) {
    value = value === "true" ? true : value === "false" ? false : value
    if (key === "VITE_PORT") {
      value = Number(value)
    }
    ret[key] = value
  }
  return ret
}

const env = loadEnv("", process.cwd(), "VITE_")
const { VITE_PORT, VITE_OPEN } = wrapperEnv(env)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() as any, vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"] // 支持的文件扩展名
  },
  build: {
    lib: {
      entry: {
        antd: resolve(__dirname, "./render/antd.ts"),
        elementUI: resolve(__dirname, "./render/element-ui.ts"),
        xlsx: resolve(__dirname, "./render/xlsx.ts"),
        index: resolve(__dirname, "./render/index.ts")
      },
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      input: {
        antd: resolve(__dirname, "./render/antd.ts"),
        elementUI: resolve(__dirname, "./render/element-ui.ts"),
        xlsx: resolve(__dirname, "./render/xlsx.ts"),
        index: resolve(__dirname, "./render/index.ts")
      },
      output: {
        //   entryFileNames: '[name].[hash].js', // 出口文件名格式
        //   chunkFileNames: '[name].[hash].js', // 代码拆分时的文件名格式
        //   assetFileNames: '[name].[hash].[ext]', // 资源文件的文件名格式
        dir: resolve(__dirname, "dist") // 输出目录
      }
    }
  },
  server: {
    port: VITE_PORT,
    open: VITE_OPEN
  },
  optimizeDeps: {
    // exclude: ['lodash-es']
  }
})
