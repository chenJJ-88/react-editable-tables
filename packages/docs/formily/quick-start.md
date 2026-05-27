# 快速开始

<script setup>
import QuickStartDemo from '../demos/formily/QuickStartDemo.tsx'
import QuickStartDemoSource from '../demos/formily/QuickStartDemo.tsx?raw'
</script>

`@react-editable-tables/formily` 是基于 Formily 2.x + antd 5.x 的高性能可编辑表格组件，通过 CellBridge 架构解决大数据量场景下的性能问题。

## 安装

```bash
npm install @react-editable-tables/formily
```

确保已安装 peer dependencies：

```bash
npm install react react-dom antd @formily/core @formily/react
```

## 交互式示例

<ClientOnly>
  <ReactDemo :component="QuickStartDemo" :source="QuickStartDemoSource" title="最小示例" description="Input + Select + 删除行" />
</ClientOnly>

## 核心概念

```tsx
import { createForm } from '@formily/core';
import { FormProvider } from '@formily/react';
import { Input, Select, Button } from 'antd';
import { FastTable } from '@react-editable-tables/formily';
import '@react-editable-tables/formily/style.css';

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
              <FastTable.Field name="name" required parse={(e: any) => e?.target?.value ?? e}>
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
- `parse`：转化控件的 `onChange` 参数为表单值（antd Input 必须配置）
- `children`：antd 表单控件（Input, Select, Switch 等）

### antd Input 需要 parse

antd 的 `Input.onChange` 传入的是 `SyntheticEvent` 而非值本身，必须使用 `parse` 提取值：

```tsx
<FastTable.Field name="name" parse={(e) => e?.target?.value ?? e}>
  <Input />
</FastTable.Field>
```

各组件 parse 规则：

| antd 组件 | onChange 参数 | 是否需要 parse | parse 函数 |
|-----------|-------------|--------------|-----------|
| Input | `e` (Event) | 是 | `(e) => e?.target?.value ?? e` |
| Input.TextArea | `e` (Event) | 是 | `(e) => e?.target?.value ?? e` |
| InputNumber | `v` (值) | 否 | — |
| Select | `v` (值) | 否 | — |
| Switch | `v` (boolean) | 否 | — |
| DatePicker | `v` (dayjs) | 否 | — |

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

## 获取和提交数据

FastTable 的数据存储在 Formily 表单中，通过 `form` 实例操作：

### 提交数据

```tsx
const form = createForm();

function App() {
  const handleSubmit = async () => {
    try {
      // 方式一：form.submit() 自动校验并返回 values
      const values = await form.submit();
      console.log('提交数据：', values.items);
    } catch (errors) {
      console.log('校验失败');
    }
  };

  // 方式二：手动获取 + 校验
  const handleSubmit2 = async () => {
    try {
      await form.validate();
      console.log('提交数据：', form.values.items);
    } catch {}
  };

  return (
    <div>
      <FormProvider form={form}>
        <FastTable name="items" ... />
      </FormProvider>
      <Button onClick={handleSubmit}>提交</Button>
    </div>
  );
}
```

### 获取当前数据

```tsx
// 随时获取当前表单值
const items = form.values.items;

// 监听数据变化
const form = createForm({
  effects() {
    onFormValuesChange((form) => {
      console.log('数据变化：', form.values.items);
    });
  },
});
```

### 重置表单

```tsx
form.reset('*', {
  forceClear: true,    // 清空所有值
  validate: false,     // 不触发校验
});
```

### 常用 form 实例方法

| 方法 | 说明 |
|------|------|
| `form.submit()` | 提交表单（校验 + 返回 values） |
| `form.validate(pattern?)` | 校验指定字段，不传则校验全部 |
| `form.reset(pattern?, options?)` | 重置表单 |
| `form.values` | 获取当前表单值 |
| `form.setValues(values)` | 设置表单值 |
| `form.setFieldState(pattern, setter)` | 设置字段状态 |
| `form.getFieldState(pattern)` | 获取字段状态 |
| `form.clearErrors(pattern?)` | 清除错误 |
| `form.query(pattern)` | 查询字段实例 |
