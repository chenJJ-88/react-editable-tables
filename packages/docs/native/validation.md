# 表单校验

<script setup>
import ValidationDemo from '../demos/native/ValidationDemo.tsx'
import ValidationDemoSource from '../demos/native/ValidationDemo.tsx?raw'
</script>

通过列定义中的 `rules` 配置校验规则，支持必填校验和自定义校验函数。

## 交互式示例

<ClientOnly>
  <ReactDemo :component="ValidationDemo" :source="ValidationDemoSource" title="表单校验" description="实时校验：必填、数字范围、邮箱格式" />
</ClientOnly>

## 基本用法

```tsx
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    rules: [{ required: true, message: '姓名不能为空' }],
    editRender: ({ value, onChange, error }) => (
      <div>
        <input value={value ?? ''} onChange={e => onChange(e.target.value)} />
        {error && <span style={{ color: 'red', fontSize: 12 }}>{error}</span>}
      </div>
    ),
  },
  {
    title: '年龄',
    dataIndex: 'age',
    rules: [
      { required: true, message: '年龄不能为空' },
      { validator: (value) => value > 0, message: '年龄必须大于 0' },
    ],
    editRender: ({ value, onChange, error }) => (
      <div>
        <input
          type="number"
          value={value ?? ''}
          onChange={e => onChange(Number(e.target.value))}
        />
        {error && <span style={{ color: 'red', fontSize: 12 }}>{error}</span>}
      </div>
    ),
  },
];
```

## 校验规则

### required — 必填校验

```tsx
rules: [{ required: true, message: '此字段不能为空' }]
```

值为 `undefined`、`null`、`''`（空字符串）时会触发校验失败。

### validator — 自定义校验

`validator` 接收当前值和行数据，返回值有三种：

| 返回值 | 含义 |
|--------|------|
| `true` | 校验通过 |
| `false` | 校验失败，使用 `message` 作为错误信息 |
| `string` | 校验失败，使用返回的字符串作为错误信息 |

```tsx
// 邮箱格式校验
rules: [{
  validator: (value) => {
    if (!value) return true; // 允许为空（非必填时）
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || '邮箱格式不正确';
  },
  message: '邮箱格式不正确'  // 当 validator 返回 false 时使用
}]
```

### 多条规则

`rules` 是数组，按顺序依次校验，遇到第一个失败即停止：

```tsx
rules: [
  { required: true, message: '请输入金额' },
  { validator: (value) => value > 0, message: '金额必须大于 0' },
  { validator: (value) => value <= 999999, message: '金额不能超过 999,999' },
]
```

## 校验触发时机

通过 `validateTrigger` 控制：

### 提交时校验（默认）

```tsx
<EditableTable validateTrigger="submit" ... />
```

只在点击「提交」按钮时校验所有字段。

### 实时校验

```tsx
<EditableTable validateTrigger="change" ... />
```

每次数据变化时立即校验，实时显示错误信息。

## 显示错误信息

`editRender` 的 `error` 参数会自动传入校验错误信息：

```tsx
editRender: ({ value, onChange, error }) => (
  <div className="cell-wrapper">
    <input
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      style={{ borderColor: error ? 'red' : undefined }}
    />
    {error && <div className="error-msg">{error}</div>}
  </div>
)
```
