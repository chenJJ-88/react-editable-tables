# 大数据量性能

<script setup>
import LargeDataDemo from '../demos/formily/LargeDataDemo.tsx'
import LargeDataDemoSource from '../demos/formily/LargeDataDemo.tsx?raw'
</script>

FastTable 使用 CellBridge 架构将 Formily Field 订阅数从 N×M 降为 N，使得 500+ 行数据也能保持良好性能。

## 交互式示例

<ClientOnly>
  <ReactDemo :component="LargeDataDemo" :source="LargeDataDemoSource" title="500 行数据" description="500 行数据，antd Table 分页，每页 20 行" />
</ClientOnly>

## 性能优化要点

1. **CellBridge 架构**：每个单元格不再创建独立的 Formily Field 订阅，而是通过行级 ArrayField 桥接值变化
2. **React.memo 优化的 CellRenderer**：避免不必要的重渲染
3. **分页**：大数据量场景建议开启分页，默认每页 10 行

```tsx
<FastTable
  name="items"
  pagination={{ pageSize: 20 }}
  ...
/>
```
