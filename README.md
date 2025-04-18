<h1  align="center">Q-ADMIN</h1>
<p align="center">前端管理系统模版</p>

### 下载
``` git clone https://gitee.com/qfg1446714867/template.git -b webVueTemplate ```
### 插件
- 组件库：<a href="https://element-plus.org/zh-CN/component/container.html">Element Plus</a>
- 状态管理：<a href="https://pinia.web3doc.top/introduction.html">Pinia</a>
- 请求：<a href="http://www.axios-js.com/zh-cn/docs/">Axios</a>
- 二维码：<a href="https://www.npmjs.com/package/qrcode#api">QrCode</a>

### 事项
- public/env 环境与代理
- public/menu.json 临时菜单模版
- public/vite.svg icon
- src/assets/css/main.scss 全局scss文件（公共css函数） 
- src/assets/icons 存储svg图标（AIcon组件图标） 
- src/components/AErCode 二维码组件
- src/components/AIcon svg图标组件
- src/components/ALayout 全局模版
- src/http/index api接口
- src/http/request axios请求
- src/router/index 路由
- src/stores/index 状态管理
- src/typing .d.ts 类型声明
- src/utils 方法
- src/views 路由组件文件
- src/main
-- 'virtual:svg-icons-register' svg图标引用
- package
-- vite --mode dev （--mode 环境）
- vite.config
-- @use "@/assets/css/main.scss" as *; 全局scss文件预加载
-- createSvgIconsPlugin svg图标引用