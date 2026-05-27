# 自定义编辑器

通过 `editRender` 可以自定义编辑态渲染，直接返回任意 React 组件即可。

## 基本用法

`editRender` 接收一个对象参数，包含以下字段：

```tsx
editRender: (props: {
  value: any;                    // 当前值
  onChange: (value: any) => void; // 值变化回调
  row: T;                        // 当前行完整数据
  rowIndex: number;              // 行索引
  error?: string;                // 校验错误信息
}) => ReactNode
```

直接返回 JSX，最灵活的方式：

```tsx
{
  title: '状态',
  dataIndex: 'status',
  editRender: ({ value, onChange }) => (
    <select value={value ?? ''} onChange={e => onChange(e.target.value)}>
      <option value="active">启用</option>
      <option value="inactive">禁用</option>
    </select>
  ),
  render: (value) => value === 'active' ? '启用' : '禁用',
}
```

## 提取为独立组件

当编辑器逻辑复杂时（如需要内部状态、副作用等），可以提取为独立组件：

### 日期选择器

```tsx
function DatePicker({ value, onChange }) {
  return (
    <input
      type="date"
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
    />
  );
}

// 在列定义中使用
{
  title: '日期',
  dataIndex: 'date',
  editRender: ({ value, onChange }) => (
    <DatePicker value={value} onChange={onChange} />
  ),
}
```

### 带搜索的下拉选择

```tsx
function SearchSelect({ value, onChange, options }) {
  const [keyword, setKeyword] = useState('');
  const filtered = options.filter(o => o.label.includes(keyword));

  return (
    <div>
      <input
        placeholder="搜索..."
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />
      <select
        value={value ?? ''}
        onChange={e => {
          onChange(e.target.value);
          setKeyword('');
        }}
        size={Math.min(filtered.length, 5)}
      >
        {filtered.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
```

## 使用第三方组件

`editRender` 返回的 JSX 不限于原生 HTML 元素，可以使用任何 React 组件：

### 使用 antd 组件

```tsx
import { Input, Select, DatePicker } from 'antd';

{
  title: '姓名',
  dataIndex: 'name',
  editRender: ({ value, onChange }) => (
    <Input value={value} onChange={e => onChange(e.target.value)} />
  ),
}

{
  title: '城市',
  dataIndex: 'city',
  editRender: ({ value, onChange }) => (
    <Select
      value={value}
      onChange={onChange}
      options={cityOptions}
      style={{ width: '100%' }}
    />
  ),
}
```

::: warning 注意
如果你需要使用 antd 组件，推荐直接使用 `@react-editable-tables/formily` 方案，它与 antd 深度集成。
:::
