# 方案选型

两个方案解决的是同一个问题 —— React 中的可编辑表格，但技术路线和适用场景不同。

## 一句话总结

- **Native**：零依赖、轻量灵活，适合不需要 antd 的场景
- **Formily**：深度集成 Formily 生态，适合已有 antd + Formily 技术栈的企业级应用

## 详细对比

| 维度 | Native | Formily |
|------|--------|---------|
| **核心依赖** | React + @tanstack/react-virtual | React + antd |
| **包体积** | 极小（无 UI 库） | 较大（antd + Formily） |
| **虚拟滚动** | 支持（1000+ 行流畅） | 不支持（依赖 antd Table） |
| **编辑模式** | 全量编辑 / 行编辑 | 全量编辑 |
| **校验系统** | 内置规则（required + validator） | Formily 完整校验 |
| **数据联动** | onFieldChange（同步/异步） | Formily effects（onFieldValueChange 等） |
| **主题** | CSS 变量，暗色模式 | antd 主题系统 |
| **单元格编辑器** | editRender 自定义 JSX | antd 表单控件（Input, Select 等） |
| **列固定** | 支持（左/右固定） | 透传 antd Table column |
| **行操作** | ref 暴露 addRow / removeRow / moveUp / moveDown | 内置添加/删除按钮 |
| **分页** | 不内置（虚拟滚动替代） | 支持（透传 antd Table pagination） |

## 选型决策树

```
你的项目已经使用 antd + Formily 吗？
├── 是 → 使用 Formily 方案
│   - 与现有技术栈无缝集成
│   - 复用 Formily 的 effects、校验、联动
│
└── 否 → 需要虚拟滚动（1000+ 行）吗？
    ├── 是 → 使用 Native 方案
    │   - 内置 @tanstack/react-virtual
    │   - 零依赖，包体积极小
    │
    └── 否 → 需要复杂的表单联动吗？
        ├── 是 → 考虑引入 Formily 方案
        │   - Formily 的响应式机制更强大
        │   - 适合多层级联动、异步校验等复杂场景
        │
        └── 否 → 使用 Native 方案
            - 更轻量、更灵活
            - editRender 可以返回任意 React 组件
```

## 典型场景

### 适合 Native 的场景

- **后台管理系统的简单配置表**：几列到十几列，百行以内，不需要复杂联动
- **数据导入/批量编辑**：大数据量 + 虚拟滚动，用户需要快速浏览和编辑
- **自定义 UI 风格**：项目不用 antd，需要表格样式与整体设计系统一致
- **移动端适配**：需要精细控制样式和交互

### 适合 Formily 的场景

- **企业级表单应用**：已有 antd + Formily 技术栈，表格是表单的一部分
- **复杂联动逻辑**：字段间多层级联动、异步加载选项、条件显隐
- **与后端 schema 对接**：利用 Formily 的 JSON Schema 能力实现动态表单
- **Formily 1.x 迁移**：从 Form.Table 平滑迁移到 Formily 2.x

## 可以同时使用吗？

可以。两个包完全独立，没有共享依赖。如果你有多个页面，可以根据每个页面的复杂度选择不同的方案。
