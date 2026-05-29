# 大数据量性能

<script setup>
import VirtualScrollDemo from '../demos/native/VirtualScrollDemo.tsx'
import VirtualScrollDemoSource from '../demos/native/VirtualScrollDemo.tsx?raw'
import LargeScrollDemo from '../demos/native/LargeScrollDemo.tsx'
import LargeScrollDemoSource from '../demos/native/LargeScrollDemo.tsx?raw'
</script>

EditableTable 基于 `@tanstack/react-virtual` 实现虚拟滚动，只渲染可视区域内的行，即使数据量达到数千行也能保持流畅。

## 交互式示例

### 500 行虚拟滚动

<ClientOnly>
  <ReactDemo :component="VirtualScrollDemo" :source="VirtualScrollDemoSource" title="500 行虚拟滚动" description="5 列，500 行数据，虚拟滚动只渲染可视区域" />
</ClientOnly>

### 500 行 × 10 列 + 横向滚动

<ClientOnly>
  <ReactDemo :component="LargeScrollDemo" :source="LargeScrollDemoSource" title="10 列横向滚动" description="500 行 × 10 列，虚拟滚动 + 横向滚动，左右列固定" />
</ClientOnly>

## 启用虚拟滚动

传入 `scrollY` 属性即可启用虚拟滚动，值为滚动容器的高度（px）：

```tsx
<EditableTable
  rowKey="id"
  columns={columns}
  dataSource={data}
  onChange={setData}
  scrollY={500}  // 启用虚拟滚动，容器高度 500px
/>
```

## 横向滚动

当列数较多、总宽度超出容器时，表格自动支持横向滚动：

- 设置每列的 `width` 属性控制列宽
- 使用 `fixed: 'left' | 'right'` 固定列，固定列在横向滚动时不会移动
- 表头和表体的横向滚动自动同步

```tsx
const columns: EditableColumn<T>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: 100,
    fixed: 'left',  // 左侧固定
    editRender: ({ value, onChange }) => (
      <input value={value ?? ''} onChange={e => onChange(e.target.value)} />
    ),
  },
  // ... 中间的列正常滚动
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    fixed: 'right',  // 右侧固定
    editable: false,
  },
];
```

## 虚拟滚动原理

1. 表格容器设置固定高度（通过 `scrollY`）
2. 通过 `@tanstack/react-virtual` 计算当前可视区域对应的行索引范围
3. 只渲染可视区域 ± 缓冲区的行
4. 滚动时动态替换渲染的行，保持 DOM 节点数量恒定

## 注意事项

- 虚拟滚动需要表格设置固定高度，通过 CSS 变量 `--et-row-height`（默认 48px）控制行高
- 列固定（`fixed: 'left' | 'right'`）在虚拟滚动下正常工作
- 行编辑模式（`editableMode="row"`）在虚拟滚动下正常工作
- 横向滚动时表头和表体自动同步
