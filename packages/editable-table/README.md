# @react-editable-tables/native

轻量、零依赖的 React 可编辑表格，内置虚拟滚动、校验、数据联动和 CSS 变量主题。

## 安装

```bash
npm install @react-editable-tables/native
```

## 使用

```tsx
import EditableTable from '@react-editable-tables/native';
import '@react-editable-tables/native/style.css';

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

## 特性

- 两种编辑模式：全量编辑（`all`）和行编辑（`row`）
- 虚拟滚动（1000+ 行）基于 @tanstack/react-virtual
- 列固定（左/右）+ 横向滚动同步
- 内置校验系统（必填、自定义规则）
- 数据联动 via `onFieldChange`（同步 & 异步）
- 自定义编辑器 via `editRender`
- 行操作 via `ref`（addRow, removeRow, moveUp, moveDown）
- CSS 变量主题，支持暗色模式

## 文档

完整文档：https://chenjj-88.github.io/react-editable-tables/

## License

MIT
