import { defineConfig, ConfigEnv, UserConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from "unplugin-auto-import/vite";
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { ENV, BASE, PROXY } from './public/env.ts'
const pathSrc = resolve(__dirname, "src");
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const currentEnv: any = { ...ENV[mode], ...BASE }
  const newProxy = PROXY(ENV[mode])
  console.log(currentEnv);
  const base = currentEnv?.name === 'DEV' ? '/' : '/dist/'
  return {
    base: base,
    plugins: [
      vue(), vueJsx(),
      AutoImport({
        imports: ["vue", "vue-router", "@vueuse/core"],
        dirs: ['./src/utils/**'],
        dts: "./src/auto-imports.d.ts",
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(pathSrc, "assets/icons"),resolve(pathSrc, "assets/icons/menu")],
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    server: {
      port: 9999,
      host: '0.0.0.0',
      open: true,
      proxy: { ...newProxy }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
              @use "@/assets/css/main.scss" as *;
            `,
        }
      },
    },
    resolve: {
      alias: {
        '@': pathSrc
      },
      extensions: ['.js', '.mjs', '.ts', '.vue', '.json', '.scss', '.css', '.tsx', 'jsx']
    },
    build: {
      chunkSizeWarningLimit: 2000,
      minify: "terser",
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: false, // 生产环境去除 console
          drop_debugger: false, // 生产环境去除 debugger
        },
        format: {
          comments: true, // 删除注释
        },
      },
    },
  }
})
