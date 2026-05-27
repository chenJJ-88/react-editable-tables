# 编辑模式

EditableTable 支持两种编辑模式，通过 `editableMode` 属性切换：

## 全量编辑（all）

默认模式。所有可编辑列直接可编辑，顶部显示「提交」按钮。

```tsx
<EditableTable
  editableMode="all"
  rowKey="id"
  columns={columns}
  dataSource={data}
  onChange={setData}
  onSubmit={(data) => {
    // 校验通过后触发
    console.log('提交数据：', data);
  }}
/>
```

**适用场景**：批量编辑、数据导入等需要同时编辑多行的场景。

## 行编辑（row）

每行显示「编辑」按钮，点击后该行进入编辑状态，出现「保存」和「取消」按钮。

```tsx
<EditableTable
  editableMode="row"
  rowKey="id"
  columns={columns}
  dataSource={data}
  onChange={setData}
/>
```

**适用场景**：逐行编辑、每次只修改一行的场景，避免误改其他行数据。

## 行编辑的工作机制

1. 点击「编辑」→ 当前行变为可编辑，内部保存原始数据快照
2. 编辑过程中修改数据 → `onChange` 正常触发
3. 点击「保存」→ 退出编辑模式，校验通过后数据生效
4. 点击「取消」→ 退出编辑模式，数据回滚到原始快照

```tsx
function App() {
  const [data, setData] = useState(initialData);

  return (
    <EditableTable
      editableMode="row"
      rowKey="id"
      columns={columns}
      dataSource={data}
      onChange={setData}
    />
  );
}
```

::: tip 提示
行编辑模式下，`onChange` 在编辑过程中就会触发（实时更新数据）。取消操作会通过 `onChange` 再次触发，将数据回滚到原始值。
:::
