# 大数据量性能

<script setup>
import VirtualScrollDemo from '../demos/formily/VirtualScrollDemo.tsx'
import VirtualScrollDemoSource from '../demos/formily/VirtualScrollDemo.tsx?raw'
</script>

FormilyEditableTable 基于行级响应式更新，配合 antd Table 分页，使得 500+ 行数据也能保持良好性能。

<ClientOnly>
  <ReactDemo :component="VirtualScrollDemo" :source="VirtualScrollDemoSource" title="500 行数据 + 固定列" description="500 行数据，分页，固定序号列和操作列，横向滚动" />
</ClientOnly>

```tsx
columns={[
  { title: '序号', width: 60, fixed: 'left', render: ({ index }) => index + 1 },
  // ... 中间列
  { title: '操作', width: 80, fixed: 'right', render: ({ index, field }) => ... },
]}
tableProps={{ scroll: { x: 'max-content' } }}
```

> **注意**：固定列必须配合 `scroll.x: 'max-content'` 使用，所有列都应设置明确的 `width`。

## 性能优化要点

1. **行级响应式更新**：仅在行数增减时重渲染表格，单元格编辑不会触发整表重渲染
2. **分页**：大数据量场景建议开启分页，默认每页 10 行
3. **固定列**：所有列设置明确 `width`
