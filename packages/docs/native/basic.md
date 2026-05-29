# 基础用法

<script setup>
import BasicDemo from '../demos/native/BasicDemo.tsx'
import BasicDemoSource from '../demos/native/BasicDemo.tsx?raw'
</script>

`@react-editable-tables/native` 是一个零 UI 库依赖的可编辑表格组件，通过 `editRender` 自定义每个单元格的编辑态渲染。

## 安装

```bash
npm install @react-editable-tables/native
```

> **注意**：Native 方案需要手动导入样式文件，否则表格没有样式：
>
> ```tsx
> import '@react-editable-tables/native/style.css';
> ```

## 交互式示例

<ClientOnly>
  <ReactDemo :component="BasicDemo" :source="BasicDemoSource" title="基础用法" description="最简单的可编辑表格，支持文本、数字、下拉选择" />
</ClientOnly>

只需传入 4 个属性即可运行：

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

## 核心概念

### columns — 列定义

每列通过 `editRender` 指定编辑态的渲染方式。`editRender` 接收以下参数：

```tsx
editRender: (props: {
  value: any;        // 当前单元格的值
  onChange: (v: any) => void;  // 更新值的回调
  row: T;            // 当前行完整数据
  rowIndex: number;  // 行索引
  error?: string;    // 校验错误信息
}) => ReactNode
```

如果不传 `editRender`，该列默认只读，显示 `String(value)`。

### dataSource + onChange — 受控数据流

表格采用受控模式，数据由外部管理：

```tsx
const [data, setData] = useState(initialData);

<EditableTable
  dataSource={data}
  onChange={setData}  // 单元格编辑后触发，返回最新数据
/>
```

### rowKey — 行唯一标识

必填属性，用于 React 的 key 和行编辑模式下追踪行状态。

```tsx
<EditableTable rowKey="id" ... />
```

## 内置编辑器示例

Native 包不依赖任何 UI 库，但你可以轻松实现常见的编辑器：

### 文本输入

```tsx
{
  title: '姓名',
  dataIndex: 'name',
  editRender: ({ value, onChange }) => (
    <input value={value ?? ''} onChange={e => onChange(e.target.value)} />
  ),
}
```

### 数字输入

```tsx
{
  title: '年龄',
  dataIndex: 'age',
  editRender: ({ value, onChange }) => (
    <input
      type="number"
      value={value ?? ''}
      onChange={e => onChange(Number(e.target.value))}
    />
  ),
}
```

### 下拉选择

```tsx
const options = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
];

{
  title: '城市',
  dataIndex: 'city',
  editRender: ({ value, onChange }) => (
    <select value={value ?? ''} onChange={e => onChange(e.target.value)}>
      <option value="">请选择</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  ),
}
```

## 只读列

不传 `editRender` 或设置 `editable: false` 的列为只读：

```tsx
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    editable: false,  // 明确标记只读
  },
  {
    title: '姓名',
    dataIndex: 'name',
    editRender: ({ value, onChange }) => (
      <input value={value ?? ''} onChange={e => onChange(e.target.value)} />
    ),
  },
];
```

只读列可以使用 `render` 自定义显示内容：

```tsx
{
  title: '状态',
  dataIndex: 'status',
  editable: false,
  render: (value) => value === 'active' ? '✅ 启用' : '❌ 禁用',
}
```
