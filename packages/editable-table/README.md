# @react-editable-tables/native

一个基于 React + TypeScript 的可编辑表格组件，支持全量编辑、行编辑、校验、虚拟滚动、横向滚动、数据联动。零 UI 库依赖。

## 特性

- **两种编辑模式**：全量编辑（`all`）和行编辑（`row`）
- **校验系统**：必填校验、自定义校验，精准定位到行-列错误
- **虚拟滚动**：大数据量（1000+ 行）流畅渲染
- **横向滚动**：多列时表头与表体滚动同步
- **数据联动**：`onFieldChange` 字段联动 + `getOptions` 动态下拉选项
- **内置编辑器**：input、number、select 三种编辑器
- **自定义编辑器**：`editRender` 返回任意组件，`editor` 传入自定义组件
- **行操作**：通过 ref 暴露 `addRow` / `removeRow` / `moveUp` / `moveDown`
- **主题定制**：CSS 变量一键换肤

## 安装

```bash
npm install @react-editable-tables/native
# 或
pnpm add @react-editable-tables/native
```

## 快速上手

```bash
pnpm install
pnpm dev
```

> 需要 Node.js 20+ 或 24+，项目根目录有 `.nvmrc` 文件。

## 文档

完整文档请访问 [文档站](https://react-editable-tables.github.io/native/)，或在本地运行：

```bash
pnpm dev
```

## 开发

```bash
pnpm dev          # 启动开发服务器（内置文档站 + 7 个交互 demo）
pnpm build        # 构建生产版本
pnpm check        # Biome 代码检查 + 格式化
pnpm test         # 运行测试
```

## License

MIT
