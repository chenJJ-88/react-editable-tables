# 大数据量性能

<script setup>
import VirtualScrollDemo from '../demos/native/VirtualScrollDemo.tsx'
import VirtualScrollDemoSource from '../demos/native/VirtualScrollDemo.tsx?raw'
</script>

EditableTable 基于 `@tanstack/react-virtual` 实现虚拟滚动，只渲染可视区域内的行，即使数据量达到数千行也能保持流畅。

## 交互式示例

<ClientOnly>
  <ReactDemo :component="VirtualScrollDemo" :source="VirtualScrollDemoSource" title="500 行虚拟滚动" description="500 行数据，虚拟滚动只渲染可视区域" />
</ClientOnly>

## 虚拟滚动原理

1. 表格容器设置固定高度（默认 400px）
2. 通过 `@tanstack/react-virtual` 计算当前可视区域对应的行索引范围
3. 只渲染可视区域 ± 缓冲区的行
4. 滚动时动态替换渲染的行，保持 DOM 节点数量恒定

## 注意事项

- 虚拟滚动需要表格设置固定高度，通过 CSS 变量 `--et-row-height`（默认 48px）控制行高
- 列固定（`fixed: 'left' | 'right'`）在虚拟滚动下正常工作
- 行编辑模式（`editableMode="row"`）在虚拟滚动下正常工作
