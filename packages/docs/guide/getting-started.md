# 快速上手

## 这是什么？

`react-editable-tables` 提供了两种 React 可编辑表格方案：

| 包名 | 适用场景 | 核心依赖 |
|------|---------|---------|
| **@react-editable-tables/native** | 轻量应用、自定义 UI、无 antd/Formily | React, @tanstack/react-virtual |
| **@react-editable-tables/formily** | 企业级应用、antd 生态、复杂表单逻辑 | React, antd |

不确定选哪个？👉 [方案选型](./comparison)

## 安装

### Native 方案

```bash
npm install @react-editable-tables/native
# 或
pnpm add @react-editable-tables/native
```

> **注意**：Native 方案需要手动导入样式文件，否则表格没有样式：
>
> ```tsx
> import '@react-editable-tables/native/style.css';
> ```

### Formily 方案

```bash
npm install @react-editable-tables/formily
```

确保已安装 peer dependencies：

```bash
npm install react react-dom antd
```

## 最简示例

### Native

```tsx
import { useState } from 'react';
import EditableTable from '@react-editable-tables/native';
import '@react-editable-tables/native/style.css';

interface User {
  id: string;
  name: string;
  age: number | undefined;
}

const columns = [
  {
    title: '姓名',
    dataIndex: 'name' as const,
    editRender: ({ value, onChange }: any) => (
      <input value={value ?? ''} onChange={e => onChange(e.target.value)} />
    ),
  },
  {
    title: '年龄',
    dataIndex: 'age' as const,
    editRender: ({ value, onChange }: any) => (
      <input
        type="number"
        value={value ?? ''}
        onChange={e => onChange(Number(e.target.value))}
      />
    ),
  },
];

function App() {
  const [data, setData] = useState<User[]>([
    { id: '1', name: '张三', age: 28 },
    { id: '2', name: '李四', age: 32 },
  ]);

  return (
    <EditableTable
      rowKey="id"
      columns={columns}
      dataSource={data}
      onChange={setData}
    />
  );
}
```

### Formily

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
            render: () => (
              <FormilyEditableTable.Field name="name" required>
                <Input />
              </FormilyEditableTable.Field>
            ),
          },
          {
            title: '操作',
            render: ({ index, field }) => (
              <Button type="link" onClick={() => field.remove(index)}>
                删除
              </Button>
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

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/chenJJ-88/react-editable-tables.git
cd react-editable-tables

# 安装依赖
pnpm install

# 启动文档站
pnpm dev:docs
```

## 下一步

- [方案选型](./comparison) — 详细对比两个方案，帮你做出选择
- [Native 基础用法](/native/basic) — 学习 Native 包的完整功能
- [Formily 快速开始](/formily/quick-start) — 学习 Formily 包的完整功能
