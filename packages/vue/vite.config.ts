import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    cssCodeSplit: true,
    target: "es2015",
    lib: {
      entry: resolve(__dirname, "src/components/watermark/index.ts"),
      name: "watermark",
      fileName: (format) => {
        if (format === "es") {
          return `watermark.js`;
        } else {
          return `watermark.${format}.js`;
        }
      },
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
        exports: "named",
      },
    },
  },
});
