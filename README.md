# react-editable-tables

> React 可编辑表格方案集 — 为不同场景提供最佳实践

## Overview

本仓库提供两种互补的 React 可编辑表格组件：

| 包 | 方案 | 依赖 | 适用场景 |
|---|------|------|---------|
| **@react-editable-tables/native** | 纯 React + TypeScript | 零 UI 库依赖 | 轻量应用、自定义设计、无 antd/Formily |
| **@react-editable-tables/formily** | Formily 2.x + antd 5.x | antd | 企业级应用、复杂表单逻辑、antd 生态 |

### @react-editable-tables/native

轻量、零依赖的可编辑表格，内置虚拟滚动、校验、数据联动和 CSS 变量主题。

- 两种编辑模式：全量编辑（`all`）和行编辑（`row`）
- 虚拟滚动（1000+ 行）基于 @tanstack/react-virtual
- 列固定（左/右）+ 横向滚动同步
- 内置校验系统（必填、自定义规则）
- 数据联动 via `onFieldChange`（同步 & 异步）
- 自定义编辑器 via `editRender`
- 行操作 via `ref`（addRow, removeRow, moveUp, moveDown）

### @react-editable-tables/formily

基于 Formily 2.x + antd 5.x 的可编辑表格，开箱即用，无需单独安装 Formily。

- 开箱即用：安装一个包即可，Formily API 已内置 re-export
- 完整 Formily effects 兼容（onFieldValueChange, form.setFieldState）
- 内置分页、新增/删除行、min/max 约束
- antd Table/Select/Input/Switch 集成
- columns 稳定化（ref-based valueLen）

## Quick Start

### Native（零依赖）

```bash
npm install @react-editable-tables/native
```

```tsx
import EditableTable from '@react-editable-tables/native';

const columns = [
  { title: '姓名', dataIndex: 'name', editRender: ({ value, onChange }) => (
    <input value={value ?? ''} onChange={e => onChange(e.target.value)} />
  )},
  { title: '年龄', dataIndex: 'age', editRender: ({ value, onChange }) => (
    <input type="number" value={value ?? ''} onChange={e => onChange(Number(e.target.value))} />
  )},
];

function App() {
  const [data, setData] = useState([
    { id: '1', name: '张三', age: 28 },
  ]);
  return (
    <EditableTable rowKey="id" columns={columns} dataSource={data} onChange={setData} />
  );
}
```

### Formily（antd + Formily，开箱即用）

```bash
npm install @react-editable-tables/formily
```

```tsx
import { createForm, FormProvider, FormilyEditableTable } from '@react-editable-tables/formily';
import { Input, Button } from 'antd';

const form = createForm();

function App() {
  return (
    <FormProvider form={form}>
      <FormilyEditableTable
        name="items"
        columns={[
          {
            title: '名称',
            render: () => <FormilyEditableTable.Field name="name" required parse={(e: any) => e?.target?.value ?? e}><Input /></FormilyEditableTable.Field>,
          },
          {
            title: '操作',
            render: ({ index, field }) => (
              <Button type="link" onClick={() => field.remove(index)}>删除</Button>
            ),
          },
        ]}
        addText="添加"
        itemDefaultValue={{ name: '' }}
        min={1}
      />
    </FormProvider>
  );
}
```

无需单独安装 `@formily/core` 或 `@formily/react`，也无需手动导入 CSS。

## Development

```bash
# 克隆仓库
git clone https://github.com/chenJJ-88/react-editable-tables.git
cd react-editable-tables

# 安装依赖（pnpm workspace 会自动处理所有子包）
pnpm install

# 启动文档站（VitePress，涵盖两个包的完整文档）
pnpm dev:docs

# 运行测试
pnpm test
```

## Documentation

运行 `pnpm dev:docs` 启动 VitePress 文档站，涵盖两个包的完整文档和交互式 Demo。

## Architecture

```
react-editable-tables/
├── packages/
│   ├── editable-table/              # @react-editable-tables/native
│   │   └── src/
│   │       ├── components/
│   │       │   └── EditableTable/   # 核心表格组件
│   │       ├── types/               # TypeScript 类型定义
│   │       └── utils/               # 校验工具
│   └── fast-editable-table/         # @react-editable-tables/formily
│       └── src/
│           ├── FormilyEditableTable.tsx        # 主表格组件
│           ├── FormilyEditableTableField.tsx   # 单元格字段组件
│           ├── style.ts             # 自动注入的样式
│           ├── types.ts             # TypeScript 类型定义
│           └── index.ts             # 入口（re-export Formily API）
├── package.json                     # 根 workspace 清单
└── pnpm-workspace.yaml              # workspace 定义
```

## Choosing Between the Two

| 维度 | Native | Formily |
|------|--------|---------|
| 已使用 antd？ | 否 | 是 |
| 需要虚拟滚动（1000+ 行）？ | 是 | 否（antd Table 适中的数据量） |
| 需要自定义 UI（无 antd）？ | 是 | 否 |
| 需要 Formily effects/联动？ | 否 | 是 |
| 包体积关注？ | 小（无 UI 库） | 较大（antd + Formily） |
| 复杂表单校验？ | 内置规则 | 完整 Formily validator |

## Contributing

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 发起 Pull Request

## License

[MIT](./LICENSE)
