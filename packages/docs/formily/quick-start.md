# 快速开始

`@react-editable-tables/formily` 是基于 Formily 2.x + antd 5.x 的高性能可编辑表格组件，通过 CellBridge 架构解决大数据量场景下的性能问题。

## 安装

```bash
npm install @react-editable-tables/formily
```

确保已安装 peer dependencies：

```bash
npm install react react-dom antd @formily/core @formily/react
```

## 最小示例

```tsx
import { createForm } from '@formily/core';
import { FormProvider } from '@formily/react';
import { Input, Select, Button } from 'antd';
import { FastTable } from '@react-editable-tables/formily';
import '@react-editable-tables/formily/src/style.css';

const form = createForm();

function App() {
  return (
    <FormProvider form={form}>
      <FastTable
        name="items"
        columns={[
          {
            title: '名称',
            render: () => (
              <FastTable.Field name="name" required>
                <Input />
              </FastTable.Field>
            ),
          },
          {
            title: '类型',
            render: () => (
              <FastTable.Field name="type">
                <Select options={[{ label: 'A', value: 'a' }]} />
              </FastTable.Field>
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
        itemDefaultValue={{ name: '', type: undefined }}
        min={1}
      />
    </FormProvider>
  );
}
```

## 核心概念

### FastTable — 表格容器

`FastTable` 会自动创建一个 Formily `ArrayField`，你只需要指定 `name` 属性：

```tsx
<FastTable name="items" columns={columns} />
```

等价于手动写：

```tsx
<Field name="items">
  {/* ArrayField 内部自动渲染表格 */}
</Field>
```

### FastTable.Field — 单元格字段

每个可编辑的单元格用 `FastTable.Field` 包裹，它内部实现了 CellBridge 优化：

```tsx
{
  title: '名称',
  render: () => (
    <FastTable.Field name="name" required>
      <Input />
    </FastTable.Field>
  ),
}
```

- `name`：字段名，对应 `itemDefaultValue` 中的 key
- `required`：必填校验
- `children`：antd 表单控件（Input, Select, Switch 等）

### itemDefaultValue — 行默认值

新增行时的默认数据结构，必须包含所有字段的初始值：

```tsx
<FastTable
  name="items"
  itemDefaultValue={{ name: '', type: undefined, count: 0, enabled: true }}
  columns={columns}
/>
```

### 列的 render 函数

每列的 `render` 函数接收 `{ index, field }` 参数：

- `index`：当前行索引
- `field`：当前行的 `ArrayField` 实例，可调用 `field.remove(index)` 删除行

```tsx
{
  title: '操作',
  render: ({ index, field }) => (
    <Button type="link" onClick={() => field.remove(index)}>删除</Button>
  ),
}
```

## 添加/删除行

FastTable 内置了添加和删除功能：

### 添加按钮

默认在底部显示「添加」按钮，可通过 `addText` 自定义文案：

```tsx
<FastTable addText="新增一行" ... />
```

隐藏添加按钮：

```tsx
<FastTable hideAdd ... />
```

修改按钮位置：

```tsx
<FastTable addButtonPosition="top" ... />
```

### 行数限制

```tsx
<FastTable
  min={1}         // 最少保留 1 行，不允许删除最后一行
  max={10}        // 最多 10 行，达到上限后隐藏添加按钮
  ...
/>
```

### 添加前校验

默认在添加新行前会校验已有行，确保数据完整。可关闭此行为：

```tsx
<FastTable validateBeforeAdd={false} ... />
```
