import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import { wrapperEnv } from "./src/utils/getEnv"

const env = loadEnv("", process.cwd(), "VITE_")
const { VITE_PORT, VITE_OPEN } = wrapperEnv(env)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() as any],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"] // 支持的文件扩展名
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "src/index.tsx")
      // output: {
      //   entryFileNames: '[name].[hash].js', // 出口文件名格式
      //   chunkFileNames: '[name].[hash].js', // 代码拆分时的文件名格式
      //   assetFileNames: '[name].[hash].[ext]', // 资源文件的文件名格式
      //   dir: path.resolve(__dirname, 'dist'), // 输出目录
      // },
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
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
