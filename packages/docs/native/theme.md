# 主题定制

<script setup>
import ThemeDemo from '../demos/native/ThemeDemo.tsx'
import ThemeDemoSource from '../demos/native/ThemeDemo.tsx?raw'
</script>

EditableTable 使用 CSS 变量控制主题，可通过覆盖变量实现自定义主题，包括暗色模式。

## 交互式示例

<ClientOnly>
  <ReactDemo :component="ThemeDemo" :source="ThemeDemoSource" title="暗色主题" description="点击按钮切换亮色/暗色主题" />
</ClientOnly>

## CSS 变量列表

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--et-border-color` | `#e8e8e8` | 边框颜色 |
| `--et-header-bg` | `#fafafa` | 表头背景色 |
| `--et-header-color` | `#333` | 表头文字颜色 |
| `--et-row-hover-bg` | `#f5f5f5` | 行 hover 背景色 |
| `--et-row-stripe-bg` | `#fafafa` | 斑马纹背景色 |
| `--et-error-color` | `#ff4d4f` | 错误提示颜色 |
| `--et-btn-primary-bg` | `#1677ff` | 主按钮背景色 |

## 覆盖变量

在表格的父容器或全局样式中覆盖变量：

```css
/* 全局覆盖 */
:root {
  --et-border-color: #d9d9d9;
  --et-header-bg: #f0f5ff;
  --et-btn-primary-bg: #1890ff;
}

/* 局部覆盖 */
.my-table {
  --et-border-color: #e0e0e0;
  --et-header-bg: #fafbfc;
}
```

```tsx
<EditableTable
  className="my-table"
  rowKey="id"
  columns={columns}
  dataSource={data}
  onChange={setData}
/>
```

## 暗色模式

通过 CSS 变量实现暗色模式：

```css
.dark-theme {
  --et-border-color: #303030;
  --et-header-bg: #1f1f1f;
  --et-header-color: #fff;
  --et-row-hover-bg: #262626;
  --et-row-stripe-bg: #1a1a1a;
  --et-error-color: #ff7875;
  --et-btn-primary-bg: #1668dc;
}
```

### 切换方式

```tsx
function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? 'dark-theme' : ''}>
      <button onClick={() => setDark(!dark)}>
        {dark ? '☀️ 亮色' : '🌙 暗色'}
      </button>
      <EditableTable ... />
    </div>
  );
}
```

### 跟随系统偏好

```css
@media (prefers-color-scheme: dark) {
  :root {
    --et-border-color: #303030;
    --et-header-bg: #1f1f1f;
    --et-header-color: #fff;
    --et-row-hover-bg: #262626;
    --et-row-stripe-bg: #1a1a1a;
    --et-error-color: #ff7875;
    --et-btn-primary-bg: #1668dc;
  }
}
```
