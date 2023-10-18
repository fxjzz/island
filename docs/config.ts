import { defineConfig } from '../dist'

export default defineConfig({
  title: 'title12',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '介绍',
          items: [
            {
              text: '快速开始',
              link: '/guide/getting-started',
            },
          ],
        },
        {
          text: '架构',
          items: [
            {
              text: 'SPA 和 MPA 对比',
              link: '/guide/spa-vs-mpa',
            },
            {
              text: '孤岛架构',
              link: '/guide/island',
            },
          ],
        },
        {
          text: '基础功能',
          items: [
            {
              text: '约定式路由',
              link: '/guide/conventional-route',
            },
          ],
        },
        {
          text: '默认主题功能',
          items: [
            {
              text: 'Home 主页',
              link: '/guide/home-page',
            },
          ],
        },
      ],
    },
  },
})
