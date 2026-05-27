# 大数据量性能

<script setup>
import LargeDataDemo from '../demos/formily/LargeDataDemo.tsx'
import LargeDataDemoSource from '../demos/formily/LargeDataDemo.tsx?raw'
</script>

FastTable 基于行级响应式更新，配合 antd Table 分页，使得 500+ 行数据也能保持良好性能。

## 交互式示例

<ClientOnly>
  <ReactDemo :component="LargeDataDemo" :source="LargeDataDemoSource" title="500 行数据" description="500 行数据，antd Table 分页，每页 20 行" />
</ClientOnly>

## 性能优化要点

1. **行级响应式更新**：仅在行数增减时重渲染表格，单元格编辑不会触发整表重渲染
2. **分页**：大数据量场景建议开启分页，默认每页 10 行

```tsx
<FastTable
  name="items"
  pagination={{ pageSize: 20 }}
  ...
/>
```
