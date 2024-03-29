# Watermark 水印组件

一个使用 vue3 开发水印组件

## 安装

```bash
npm i @jkun/watermark-vue
```

## 使用

```js
import watermark from "@jkun/watermark-vue";
import { createApp } from "vue";
createApp().use(watermark);
```

> 如果引入是 umd 模块则无需手动引入 css（@jkun/watermark-vue/dist/watermark.umd.js）

<!-- Auto Generated Below -->

## 示例

[示例请查看](https://blog.jikun.dev/docs/watermark-vue.html)

## Props

| prop    | 描述           | 类型   | 默认值           |
| ------- | -------------- | ------ | ---------------- | --- |
| content | 内容           | string | string[]         |     |
| font    | [font](#font)  | object | rgba(0,0,0,0.15) |
| gap     | 间隔           | array  | [100, 100]       |
| width   | 宽度           | string | 100%             |
| height  | 高度           | string | 100%             |
| offset  | 偏移           | array  |                  |
| rotate  | 水印的旋转角度 | number | -22              |
| zIndex  | 水印的层级     | number | 9                |
| image   | 图片 url       | string |                  |

## font

| key        | 描述     | 类型   | 默认值                    |
| ---------- | -------- | ------ | ------------------------- |
| fontFamily | 字体     | string | 'PingFang SC, sans-serif' |
| fontSize   | 字体大小 | number | 14                        |
| fontStyle  | 字体样式 | string | 'normal'                  |
| color      | 字体颜色 | string | 'normal'                  |
| fontWeight | 字体粗细 | string | 'normal'                  |
