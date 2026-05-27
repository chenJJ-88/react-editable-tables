# 行操作

<script setup>
import RowOpsDemo from '../demos/native/RowOpsDemo.tsx'
import RowOpsDemoSource from '../demos/native/RowOpsDemo.tsx?raw'
</script>

通过 `ref` 获取表格实例，调用 `addRow`、`removeRow`、`moveUp`、`moveDown` 等方法。

## 交互式示例

<ClientOnly>
  <ReactDemo :component="RowOpsDemo" :source="RowOpsDemoSource" title="行操作" description="新增行、上移、下移、删除行" />
</ClientOnly>

## 基本用法

```tsx
import { useRef } from 'react';
import EditableTable, { EditableTableInstance } from '@react-editable-tables/native';

function App() {
  const tableRef = useRef<EditableTableInstance<User>>(null);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => tableRef.current?.addRow({ id: Date.now().toString(), name: '', age: undefined })}>
          新增行
        </button>
        <button onClick={() => tableRef.current?.removeRow(0)}>
          删除第一行
        </button>
      </div>

      <EditableTable
        ref={tableRef}
        rowKey="id"
        columns={columns}
        dataSource={data}
        onChange={setData}
      />
    </div>
  );
}
```

## 实例方法

### addRow(defaults?)

在末尾新增一行。可选传入默认值对象。

```tsx
// 新增空行
tableRef.current?.addRow();

// 新增带默认值的行
tableRef.current?.addRow({ id: 'new', name: '新用户', age: 0 });
```

### removeRow(rowIndex)

删除指定索引的行。

```tsx
tableRef.current?.removeRow(0);  // 删除第一行
tableRef.current?.removeRow(2);  // 删除第三行
```

::: warning 注意
`rowIndex` 是数据数组的索引，不是页码索引。删除行后，后续行的索引会前移。
:::

### moveUp(rowIndex)

将指定行上移一位。

```tsx
tableRef.current?.moveUp(2);  // 第三行上移到第二行
```

第一行调用 `moveUp` 无效果。

### moveDown(rowIndex)

将指定行下移一位。

```tsx
tableRef.current?.moveDown(0);  // 第一行下移到第二行
```

最后一行调用 `moveDown` 无效果。

### getData()

获取当前表格数据。

```tsx
const currentData = tableRef.current?.getData();
```

## 配合列固定使用

行操作按钮通常放在固定列中，确保滚动时始终可见：

```tsx
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    fixed: 'left',  // 左固定
    width: 120,
    editRender: ({ value, onChange }) => (
      <input value={value ?? ''} onChange={e => onChange(e.target.value)} />
    ),
  },
  // ... 其他列
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',  // 右固定
    width: 120,
    editable: false,
    render: (_value, _row, rowIndex) => (
      <div>
        <button onClick={() => tableRef.current?.moveUp(rowIndex)}>↑</button>
        <button onClick={() => tableRef.current?.moveDown(rowIndex)}>↓</button>
        <button onClick={() => tableRef.current?.removeRow(rowIndex)}>删除</button>
      </div>
    ),
  },
];
```
