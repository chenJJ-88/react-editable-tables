import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitepress';

export default defineConfig({
    title: 'React Editable Tables',
    description: 'React 可编辑表格方案集 — 原生轻量版 & Formily 高性能版',
    lang: 'zh-CN',
    base: '/react-editable-tables/',
    lastUpdated: true,
    appearance: false,

    vite: {
        plugins: [react()],
    },

    head: [
        ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
        ['meta', { property: 'og:image', content: '/logo.png' }],
        ['meta', { property: 'og:title', content: 'React Editable Tables' }],
        ['meta', { property: 'og:description', content: 'React 可编辑表格方案集 — 原生轻量版 & Formily 高性能版' }],
    ],

    themeConfig: {
        logo: '/logo.png',

        nav: [
            { text: '指南', link: '/guide/getting-started' },
            { text: 'Native', link: '/native/basic' },
            { text: 'Formily', link: '/formily/quick-start' },
            {
                text: '更新日志',
                link: 'https://github.com/chenJJ-88/react-editable-tables',
            },
        ],

        sidebar: {
            '/guide/': [
                {
                    text: '开始',
                    items: [
                        { text: '快速上手', link: '/guide/getting-started' },
                        { text: '方案选型', link: '/guide/comparison' },
                    ],
                },
            ],
            '/native/': [
                {
                    text: '使用指南',
                    items: [
                        { text: '基础用法', link: '/native/basic' },
                        { text: '编辑模式', link: '/native/edit-mode' },
                        { text: '表单校验', link: '/native/validation' },
                        { text: '数据联动', link: '/native/linkage' },
                        { text: '自定义编辑器', link: '/native/custom-editor' },
                        { text: '行操作', link: '/native/row-ops' },
                        { text: '大数据量性能', link: '/native/performance' },
                    ],
                },
                {
                    text: 'API',
                    items: [{ text: 'API 参考', link: '/native/api' }],
                },
            ],
            '/formily/': [
                {
                    text: '使用指南',
                    items: [
                        { text: '快速开始', link: '/formily/quick-start' },
                        { text: 'Effects 兼容', link: '/formily/effects' },
                        { text: '大数据量性能', link: '/formily/large-data' },
                    ],
                },
                {
                    text: 'API',
                    items: [{ text: 'API 参考', link: '/formily/api' }],
                },
            ],
        },

        search: {
            provider: 'local',
            options: {
                locales: {
                    root: {
                        translations: {
                            button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
                            modal: {
                                noResultsText: '无法找到相关结果',
                                resetButtonTitle: '清除查询条件',
                                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
                            },
                        },
                    },
                },
            },
        },

        editLink: {
            pattern: 'https://github.com/chenJJ-88/react-editable-tables/edit/main/packages/docs/:path',
            text: '在 GitHub 上编辑此页',
        },

        footer: {
            message: '基于 MIT 许可发布',
        },

        docFooter: {
            prev: '上一页',
            next: '下一页',
        },

        outline: {
            label: '页面导航',
        },

        lastUpdated: {
            text: '最后更新于',
        },

        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
    },
});
